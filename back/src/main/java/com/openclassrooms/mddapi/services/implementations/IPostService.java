package com.openclassrooms.mddapi.services.implementations;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.mddapi.dto.request.PostRequestDto;
import com.openclassrooms.mddapi.dto.response.CommentResponseDto;
import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.dto.response.PostsFeedResponseDto;
import com.openclassrooms.mddapi.exceptions.ResourceNotFoundException;
import com.openclassrooms.mddapi.mappers.CommentMapper;
import com.openclassrooms.mddapi.mappers.PostMapper;
import com.openclassrooms.mddapi.models.Post;
import com.openclassrooms.mddapi.models.Topic;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.CommentRepository;
import com.openclassrooms.mddapi.repositories.PostRepository;
import com.openclassrooms.mddapi.repositories.TopicRepository;
import com.openclassrooms.mddapi.repositories.UserRepository;
import com.openclassrooms.mddapi.services.PostService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IPostService implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final TopicRepository topicRepository;
    private final CommentRepository commentRepository;
    private final PostMapper postMapper;
    private final CommentMapper commentMapper;
    
    private static final int FEED_SIZE = 20;

    @Override
    @Transactional
    public PostsFeedResponseDto createPost(PostRequestDto postRequestDto) {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
    
        // Check if the topic exists
        Topic topic = topicRepository.findById(postRequestDto.getTopicId())
                .orElseThrow(() -> new ResourceNotFoundException("Topic non trouvé avec l'ID: " + postRequestDto.getTopicId()));
    
        // Create the post
        Post post = postMapper.fromRequestDto(postRequestDto);
        post.setAuthor(currentUser);
        post.setTopic(topic);
        
        // Save the post
        post = postRepository.save(post);
        return postMapper.toDto(post);
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponseDto getPostById(Long postId) {
        Post post = postRepository.findPostWithAuthorAndTopic(postId);
        if (post == null) {
            throw new ResourceNotFoundException("Post non trouvé avec l'ID: " + postId);
        }

        // Convert the post to DTO
        PostResponseDto postDetailDto = postMapper.toDetailDto(post);
        
        // Get the comments for the post and add them manually
        List<CommentResponseDto> commentDtos = commentRepository.findByPostId(postId)
                .stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
        
        postDetailDto.setComments(commentDtos);
        return postDetailDto;
    }


    @Override
    @Transactional(readOnly = true)
    public List<PostsFeedResponseDto> getFeedPosts(String sortDirection) {
        // Get authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        // Sort posts by creation date
        Sort sort = "asc".equalsIgnoreCase(sortDirection) 
            ? Sort.by("creationDate").ascending() 
            : Sort.by("creationDate").descending();
            
        // Get posts from subscribed topics
        return postRepository.findPostsFromSubscribedTopics(
                currentUser, 
                PageRequest.of(0, FEED_SIZE, sort))
                .stream()
                .map(postMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostsFeedResponseDto> getPostsByTopic(Long topicId) {
        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new ResourceNotFoundException("Topic non trouvé avec l'ID: " + topicId));
        
        return postRepository.findByTopicOrderByCreationDateDesc(topic)
                .stream()
                .map(postMapper::toDto)
                .collect(Collectors.toList());
    }
}