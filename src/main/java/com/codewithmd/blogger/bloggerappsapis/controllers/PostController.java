package com.codewithmd.blogger.bloggerappsapis.controllers;

import java.io.IOException;
import java.io.InputStream;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.codewithmd.blogger.bloggerappsapis.config.ApiConstants;
import com.codewithmd.blogger.bloggerappsapis.config.ErrorConfig;
import com.codewithmd.blogger.bloggerappsapis.exception.ResponseModel;
import com.codewithmd.blogger.bloggerappsapis.exception.ResponseObjectModel;
import com.codewithmd.blogger.bloggerappsapis.payloads.PostDto;
import com.codewithmd.blogger.bloggerappsapis.payloads.PostEnum;
import com.codewithmd.blogger.bloggerappsapis.payloads.ShareEmail;
import com.codewithmd.blogger.bloggerappsapis.payloads.SortDirEnum;
import com.codewithmd.blogger.bloggerappsapis.services.interfaces.FileService;
import com.codewithmd.blogger.bloggerappsapis.services.interfaces.PostService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/post")
public class PostController {

	@Autowired
	private PostService postService;
	@Autowired
	private FileService fileService;

	@Value("${project.image}")
	private String path;

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@CrossOrigin
	@PostMapping(value = "/user/{userId}/category/{categoryId}/post", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> createPost(@Valid @RequestBody PostDto postDto, @PathVariable Integer userId,
			@PathVariable Integer categoryId) {
		ResponseModel createPost = this.postService.createPost(postDto, userId, categoryId);
		return new ResponseEntity<>(createPost.getResponse(), createPost.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/{id}/{like}/{userId}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> addLikeAndDisLike(@PathVariable Integer id, @PathVariable Boolean like,
			@PathVariable Integer userId) {
		ResponseModel likeAndDisLike = this.postService.addLikeAndDisLike(id, like, userId);
		return new ResponseEntity<>(likeAndDisLike.getResponse(), likeAndDisLike.getResponseCode());
	}

	@CrossOrigin
	@PostMapping(value = "/share", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> sharePost(@RequestBody ShareEmail shareEmail) {
		ResponseModel sharePost = this.postService.sharePost(shareEmail);
		return new ResponseEntity<>(sharePost.getResponse(), sharePost.getResponseCode());
	}

	@CrossOrigin
	@PutMapping(produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> updatePost(@Valid @RequestBody PostDto postDto) {
		ResponseModel updatePost = this.postService.updatePost(postDto);
		return new ResponseEntity<>(updatePost.getResponse(), updatePost.getResponseCode());
	}

	@CrossOrigin
	@DeleteMapping(value = "/{id}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> deletePost(@PathVariable Integer id) {
		ResponseModel deletePost = this.postService.deletePost(id);
		return new ResponseEntity<>(deletePost.getResponse(), deletePost.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/user/{userId}/posts", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getPostByUser(@PathVariable Integer userId) {
		ResponseObjectModel postByUser = this.postService.getPostByUser(userId);
		return new ResponseEntity<>(postByUser.getResponse(), postByUser.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/user/{userId}/post", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getPostByUser(@PathVariable Integer userId,
			@RequestParam(value = "pageNumber", defaultValue = ApiConstants.PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "sortByField", defaultValue = ApiConstants.SORT_BY, required = false) PostEnum sortByField,
			@RequestParam(value = "sortBy", required = false) String sortBy) {
		ResponseObjectModel postByUser = this.postService.getPostByUser(userId, pageNumber, sortByField.toString(),
				sortBy);
		return new ResponseEntity<>(postByUser.getResponse(), postByUser.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/user/{userId}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getSavedPostByUser(@PathVariable Integer userId,
			@RequestParam(value = "pageNumber", defaultValue = ApiConstants.PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "sortBy", defaultValue = ApiConstants.SORT_BY, required = false) PostEnum sortBy,
			@RequestParam(value = "sortDir", defaultValue = ApiConstants.SORT_DIR, required = false) SortDirEnum sortDir) {
		ResponseObjectModel postByUser = this.postService.getSavedPostByUser(userId, pageNumber, sortBy.toString(),
				sortDir.toString());
		return new ResponseEntity<>(postByUser.getResponse(), postByUser.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/category/{categoryId}/posts", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getPostByCategory(@PathVariable Integer categoryId) {
		ResponseObjectModel postByCategory = this.postService.getPostByCategory(categoryId);
		return new ResponseEntity<>(postByCategory.getResponse(), postByCategory.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/save/category/{categoryId}/user/{userId}/posts", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getSavePostByCategory(@PathVariable Integer categoryId,
			@PathVariable Integer userId) {
		ResponseObjectModel postByCategory = this.postService.getSavePostByCategory(categoryId, userId);
		return new ResponseEntity<>(postByCategory.getResponse(), postByCategory.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/category/{categoryId}/user/{userId}/posts", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getPostByCategoryAndUser(@PathVariable Integer categoryId,
			@PathVariable Integer userId) {
		ResponseObjectModel postByCategory = this.postService.getPostByCategoryAndUser(categoryId, userId);
		return new ResponseEntity<>(postByCategory.getResponse(), postByCategory.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/{id}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getPostById(@PathVariable Integer id) {
		ResponseObjectModel postById = this.postService.getPostById(id);
		return new ResponseEntity<>(postById.getResponse(), postById.getResponseCode());
	}

	// post Image Upload

	@CrossOrigin
	@GetMapping(value = "/getall/posts", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getAllPosts(
			@RequestParam(value = "pageNumber", defaultValue = ApiConstants.PAGE_NUMBER, required = false) Integer pageNumber,
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestHeader(required = false) Integer userId) {

		ResponseObjectModel allPosts = this.postService.getAllPost(pageNumber, sortBy, userId);
		return new ResponseEntity<>(allPosts.getResponse(), allPosts.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/search", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> searchPosts(@RequestParam(value = "keyword") String keyword,
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestHeader(required = false) Integer userId) {
		ResponseObjectModel searchPosts = this.postService.searchPost(keyword, pageNumber, sortBy, userId);
		return new ResponseEntity<>(searchPosts.getResponse(), searchPosts.getResponseCode());
	}
	@CrossOrigin
	@GetMapping(value = "/search/user", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> searchPostsByUser(@RequestParam(value = "keyword") String keyword,
			@RequestParam(value = "pageNumber", defaultValue = "0", required = false) Integer pageNumber,
			@RequestParam(value = "sortBy", required = false) String sortBy,
			@RequestHeader Integer userId) {
		ResponseObjectModel searchPosts = this.postService.searchPostByUser(keyword, pageNumber, sortBy, userId);
		return new ResponseEntity<>(searchPosts.getResponse(), searchPosts.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/{postId}/user/{userId}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> savedPost(@PathVariable Integer userId, @PathVariable Integer postId) {
		ResponseModel createPost = this.postService.savedPost(userId, postId);
		return new ResponseEntity<>(createPost.getResponse(), createPost.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/unsave/{postId}/user/{userId}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> unSavedPost(@PathVariable Integer userId, @PathVariable Integer postId) {
		ResponseModel createPost = this.postService.unSavedPost(userId, postId);
		return new ResponseEntity<>(createPost.getResponse(), createPost.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/{postId}/user/{userId}/save", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> isPostSave(@PathVariable Integer userId, @PathVariable Integer postId) {
		ResponseModel createPost = this.postService.isPostSave(userId, postId);
		return new ResponseEntity<>(createPost.getResponse(), createPost.getResponseCode());
	}

	@CrossOrigin
	@PostMapping(value = "/image/upload/{postId}/{imageName}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> uploadImage(@RequestParam("image") MultipartFile image, @PathVariable Integer postId,
			@PathVariable(value = "imageName", required = false) String imageName) {
		String fileName = null;
		try {
			ResponseObjectModel responseObjectModel = this.postService.getPostById(postId);
			fileName = this.fileService.uploadImage(path, image, postId, imageName);
			PostDto postDto = (PostDto) responseObjectModel.getResponse();
			postDto.setImageName(fileName);
			this.postService.updatePost(postDto);
			return new ResponseEntity<>(ErrorConfig.updateMessage("Profile Image"), HttpStatus.OK);
		} catch (Exception e) {
			logger.error("uploadImage ", e);
			return new ResponseEntity<>(ErrorConfig.unknownError(), HttpStatus.OK);
		}
	}

	@CrossOrigin
	@GetMapping(value = "/image/{imageName}", produces = MediaType.IMAGE_JPEG_VALUE)
	public void downloadImage(@PathVariable("imageName") String imageName, HttpServletResponse response)
			throws IOException {
		logger.info("This is an informational log message");

		InputStream resource = this.fileService.getResource(path, imageName);
		logger.error("This is an error log message");
		response.setContentType(MediaType.IMAGE_JPEG_VALUE);
		StreamUtils.copy(resource, response.getOutputStream());

	}

	@CrossOrigin
	@PostMapping(value = "/subscribe/user/{currentSubsciberId}/{bloggerUserId}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> setSubscriber(@PathVariable Integer currentSubsciberId,
			@PathVariable Integer bloggerUserId) {
		ResponseObjectModel setSubscriber = this.postService.setSubscriber(currentSubsciberId, bloggerUserId);
		return new ResponseEntity<>(setSubscriber.getResponse(), setSubscriber.getResponseCode());
	}

	@CrossOrigin
	@GetMapping(value = "/subscribe/user/{currentSubsciberId}/{bloggerUserId}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> getSubscriber(@PathVariable Integer currentSubsciberId,
			@PathVariable Integer bloggerUserId) {
		ResponseObjectModel getSubscriber = this.postService.getSubscriber(currentSubsciberId, bloggerUserId);
		return new ResponseEntity<>(getSubscriber.getResponse(), getSubscriber.getResponseCode());
	}

	@CrossOrigin
	@PostMapping(value = "/unsubscribe/user/{currentSubsciberId}/{bloggerUserId}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> unSubscribe(@PathVariable Integer currentSubsciberId,
			@PathVariable Integer bloggerUserId) {
		ResponseObjectModel unSubscribe = this.postService.unSubscribe(currentSubsciberId, bloggerUserId);
		return new ResponseEntity<>(unSubscribe.getResponse(), unSubscribe.getResponseCode());
	}
	
	@CrossOrigin
	@GetMapping(value = "/download/{postId}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> downloadPost(@PathVariable Integer postId) throws IOException {
		ResponseObjectModel getSubscriber = this.postService.downloadPostInPDF( postId);
		return new ResponseEntity<>(getSubscriber.getResponse(), getSubscriber.getResponseCode());
	}

//	@CrossOrigin
//	@GetMapping(value = "/save/category/{categoryId}/user/{userId}", produces = "application/json; charset=utf-8")
//	public ResponseEntity<Object> getSavePostByCategoryAndUser(@PathVariable Integer categoryId,
//			@PathVariable Integer userId) {
//		ResponseObjectModel postByCategory = this.postService.getSavePostByCategoryAndUser(categoryId, userId);
//		return new ResponseEntity<>(postByCategory.getResponse(), postByCategory.getResponseCode());
//	}

}
