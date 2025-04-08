package com.openclassrooms.mddapi.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.openclassrooms.mddapi.dto.request.PostRequestDto;
import com.openclassrooms.mddapi.dto.response.PostResponseDto;
import com.openclassrooms.mddapi.dto.response.PostsFeedResponseDto;
import com.openclassrooms.mddapi.services.PostService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostsFeedResponseDto> createPost(@Valid @RequestBody PostRequestDto postRequestDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(postService.createPost(postRequestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable("id") Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostsFeedResponseDto>> getFeedPosts(
            @RequestParam(value = "sort", defaultValue = "desc") String sortDirection) {
        return ResponseEntity.ok(postService.getFeedPosts(sortDirection));
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<PostsFeedResponseDto>> getPostsByTopic(@PathVariable("topicId") Long topicId) {
        return ResponseEntity.ok(postService.getPostsByTopic(topicId));
    }
}