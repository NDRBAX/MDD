package com.openclassrooms.mddapi.services.implementations;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.openclassrooms.mddapi.dto.request.CommentRequestDto;
import com.openclassrooms.mddapi.dto.response.CommentResponseDto;
import com.openclassrooms.mddapi.exceptions.ResourceNotFoundException;
import com.openclassrooms.mddapi.mappers.CommentMapper;
import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.models.Post;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.repositories.CommentRepository;
import com.openclassrooms.mddapi.repositories.PostRepository;
import com.openclassrooms.mddapi.repositories.UserRepository;
import com.openclassrooms.mddapi.services.CommentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ICommentService implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentMapper commentMapper;

    @Override
    @Transactional
    public CommentResponseDto createComment(CommentRequestDto commentRequestDto) {
        // Get the current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
    
        // Get the post
        Post post = postRepository.findById(commentRequestDto.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Post non trouvé avec l'ID: " + commentRequestDto.getPostId()));
    
        // Create the comment
        Comment comment = commentMapper.fromRequestDto(commentRequestDto);
        comment.setAuthor(currentUser);
        comment.setPost(post);
        
        // Save
        comment = commentRepository.save(comment);
        return commentMapper.toDto(comment);
    }
    @Override
    @Transactional(readOnly = true)
    public List<CommentResponseDto> getCommentsByPostId(Long postId) {
        // Check if the post exists
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post non trouvé avec l'ID: " + postId);
        }
        
        return commentRepository.findByPostId(postId)
                .stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }
}