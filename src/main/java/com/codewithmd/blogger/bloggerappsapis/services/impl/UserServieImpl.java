package com.codewithmd.blogger.bloggerappsapis.services.impl;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import java.security.GeneralSecurityException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.codewithmd.blogger.bloggerappsapis.exception.ResponseModel;
import com.codewithmd.blogger.bloggerappsapis.exception.ResponseObjectModel;
import com.codewithmd.blogger.bloggerappsapis.helper.EmailService;
import com.codewithmd.blogger.bloggerappsapis.helper.EncryptionUtils;
import com.codewithmd.blogger.bloggerappsapis.helper.JavaHelper;
import com.codewithmd.blogger.bloggerappsapis.account.entity.ClientRole;
import com.codewithmd.blogger.bloggerappsapis.account.entity.Role;
import com.codewithmd.blogger.bloggerappsapis.account.model.UserType;
import com.codewithmd.blogger.bloggerappsapis.account.repo.RoleRepo;
import com.codewithmd.blogger.bloggerappsapis.account.service.ClientRoleService;

import com.codewithmd.blogger.bloggerappsapis.config.ErrorConfig;
import com.codewithmd.blogger.bloggerappsapis.entities.Comment;
import com.codewithmd.blogger.bloggerappsapis.entities.Post;
import com.codewithmd.blogger.bloggerappsapis.entities.User;
import com.codewithmd.blogger.bloggerappsapis.payloads.UserDto;
import com.codewithmd.blogger.bloggerappsapis.payloads.WelcomeEmailModel;
import com.codewithmd.blogger.bloggerappsapis.repos.CommentRepo;
import com.codewithmd.blogger.bloggerappsapis.repos.PostRepo;
import com.codewithmd.blogger.bloggerappsapis.repos.SubscribeRepo;
import com.codewithmd.blogger.bloggerappsapis.repos.UserRepo;
import com.codewithmd.blogger.bloggerappsapis.services.interfaces.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class UserServieImpl implements UserService {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private RoleRepo roleRepo;

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private ClientRoleService clientRoleService;

	@Autowired
	private EmailService emailService;

	@Autowired
	private PostRepo postRepo;

	@Autowired
	private PostServiceImpl postService;

	@Autowired
	private CommentRepo commentRepo;

	@Autowired
	private SubscribeRepo subscribeRepo;

	@Value("${clientId}")
	private String clientId;

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	public ResponseModel createUser(UserDto userDto) {
		try {

			if (userDto.checkValidationForRegister()) {

				Optional<User> userExist = userRepo.findByEmail(userDto.getEmail());
				if (userExist.isPresent()) {
					return new ResponseModel("User already exist", HttpStatus.BAD_REQUEST, true);
				}
				User user = this.dtoToUser(userDto);
				user.setSuspendUser(false);
				user.setEmail(user.getEmail().toLowerCase().trim());
				if (JavaHelper.checkStringValue(user.getPassword()).equals("")) {
					user.setPassword(null);
				} else {
					user.setPassword(user.getPassword());

				}

				user.setProfileCreatedDate(JavaHelper.getCurrentDate().toString());
				user.setLinkExpiryDate(JavaHelper.getCurrentDate().toString());
				user.setId(idGenerator());
				user.setWelcomeEmail(false);
				if (Boolean.FALSE.equals(emailService.sendEmailForRegister(user))) {
					return new ResponseModel("An unknown error occurred.Please try again later.",
							HttpStatus.BAD_REQUEST, true);
				}
				this.usertoDto(userRepo.save(user));
				Role role = getByUserType(UserType.NORMAL_USER);
				if (role != null) {
					ClientRole newRole = new ClientRole();
					newRole.setClientId(Long.valueOf(user.getId()));
					newRole.setRoleId(role.getRoleId());
					clientRoleService.save(newRole);
				} else {
					return new ResponseModel("No role found for " + UserType.NORMAL_USER, HttpStatus.BAD_REQUEST, true);
				}

				return new ResponseModel(ErrorConfig.addMessage("User"), HttpStatus.OK);
			}
			return new ResponseModel("Invalid credentials", HttpStatus.BAD_REQUEST, true);
		} catch (Exception e) {
			logger.error("createUser ", e);
			return new ResponseModel(ErrorConfig.unknownError(), HttpStatus.BAD_REQUEST);
		}
	}

	public Integer idGenerator() {
		Integer id;
		while (true) {
			id = JavaHelper.getId();

			if (userRepo.checkId(id) == 0) {
				return id;
			}
		}
	}

	public ResponseModel updateUser(UserDto userDto) {
		try {
			Optional<User> userOptional = userRepo.findById(userDto.getId());
			if (userOptional.isPresent()) {
				User user = userOptional.get();
				user.setAbout(userDto.getAbout());
				user.setEmail(userDto.getEmail());
				user.setName(userDto.getName());
				user.setImageName(userDto.getImageName());
				if (!userDto.getPassword().isEmpty()) {
					user.setPassword(EncryptionUtils.encrypt(userDto.getPassword()));
				}

				userRepo.save(user);
				return new ResponseModel(ErrorConfig.updateMessage("User"), HttpStatus.ACCEPTED);
			} else {
				return new ResponseModel(ErrorConfig.updateError("User"), HttpStatus.BAD_REQUEST);
			}
		} catch (Exception e) {
			logger.error("updateUser ", e);
			return new ResponseModel(ErrorConfig.unknownError(), HttpStatus.BAD_REQUEST);
		}
	}

	public ResponseObjectModel getUserById(Integer userId) {
		UserDto userDto = new UserDto();
		try {
			User user = userRepo.getById(userId);
			userDto = this.usertoDto(user);
			userDto.setRole(
					roleRepo.findByRoleId(roleRepo.getClientRoleFromClientId(Long.valueOf(userId)).getRoleId()));

			List<Post> posts = postRepo.findByUser(user);
			int likeCount = 0;
			int dislikeCount = 0;
			int totalViews = 0;
			for (Post post : posts) {
				likeCount += post.getLikePost();
				dislikeCount += post.getDisLikePost();
				totalViews += post.getNumberOfViews();
			}
			userDto.setProfileCreatedDate(localDate(userDto.getProfileCreatedDate()));
			userDto.setNumberOfPosts(posts.size());
			userDto.setTotalSubscriber(subscribeRepo.findByBloggerUserId(userId).size());
			userDto.setNumberOfViews(totalViews);
			userDto.setLikeCount(likeCount);
			userDto.setDislikeCount(dislikeCount);
			return new ResponseObjectModel(userDto, HttpStatus.OK);
		} catch (Exception e) {
			logger.error("getUserById ", e);
			return new ResponseObjectModel(userDto, HttpStatus.BAD_REQUEST);
		}
	}

	private String localDate(String dateStr) {

		SimpleDateFormat inputFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");

		// Define the output date format
		SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd");

		try {
			// Parse the input date string into a Date object
			Date date = inputFormat.parse(dateStr);

			// Format the Date object into the desired output format
			String formattedDate = outputFormat.format(date);
			return formattedDate;

		} catch (Exception e) {
			System.err.println("Error parsing the date: " + e.getMessage());
		}
		return dateStr;

	}

	public ResponseObjectModel getAllUsers() {
		List<UserDto> userDto = new ArrayList<>();
		try {
			List<User> users = this.userRepo.findAll();

			for (User user : users) {
				System.out.println(user.getPassword());
				System.out.println(user.getEmail());
			}
			userDto = users.stream().map(user -> this.usertoDto(user)).collect(Collectors.toList());
			return new ResponseObjectModel(userDto, HttpStatus.OK);
		} catch (Exception e) {
			logger.error("getAllUsers ", e);
			return new ResponseObjectModel(userDto, HttpStatus.BAD_REQUEST);
		}
	}

	public ResponseObjectModel getAllRealUsers() {
		List<UserDto> userDto = new ArrayList<>();
		try {
			List<User> users = this.userRepo.findAll();

			return new ResponseObjectModel(users, HttpStatus.OK);
		} catch (Exception e) {
			logger.error("getAllUsers ", e);
			return new ResponseObjectModel(userDto, HttpStatus.BAD_REQUEST);
		}
	}

	public ResponseModel deleteUser(Integer userId) {
		try {
			Optional<User> user = this.userRepo.findById(userId);
			if (!user.isEmpty()) {
				List<Post> posts = postRepo.findByUser(user.get());
				for (Post post : posts) {
					postService.deletePost(post.getPostId());
				}
				List<Comment> comments = commentRepo.findByUser(user.get());
				commentRepo.deleteAll(comments);
				this.userRepo.delete(user.get());
				return new ResponseModel(ErrorConfig.deleteMessage("User", userId.toString()), HttpStatus.OK);
			} else {
				return new ResponseModel(ErrorConfig.notFoundException("User", userId.toString()),
						HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			logger.error("deleteUser ", e);
			return new ResponseModel(ErrorConfig.unknownError(), HttpStatus.BAD_REQUEST);
		}
	}

//	@Scheduled(cron = "*/10 * * * * *")
//	public void welcomeEmailToNewUser() {
//		try {
//			List<WelcomeEmailModel> newUsers = userRepo.getIdsOfNewUsers();
//			for (WelcomeEmailModel newUser : newUsers) {
//				emailService.sendWelcomeEmailToUser(newUser.getUserName(), newUser.getEmail());
//			}
//
//			List<Post> recommendedPosts = postRepo.findAll();
//
//			for (Post post : recommendedPosts) {
//				Integer sum = getRecommendedPostSum(post);
//				if (post.getRecommendedPost() != sum) {
//					post.setRecommendedPost(sum);
//					postRepo.save(post);
//				}
//
//			}
//			List<Post> posts = postRepo.findAllPostUnCheckedContent();
//			List<Post> newPosts = postRepo.findAllPostNewContent();
//
//			for (Post post : newPosts) {
//				post.setSusbscriberEmail(true);
//				Integer userId = post.getUser().getId();
//
//				List<Integer> subUserIds = subscribeRepo.findByBloggerUserId(userId);
//
//				for (Integer subUserId : subUserIds) {
//					Optional<User> user = userRepo.findById(subUserId);
//					emailService.sendNotificationEmail(user, post);
//				}
//
//				postRepo.save(post);
//			}
//
//			for (Post post : posts) {
//				if (containsAbusiveWords(post.getContent())) {
//					Integer userId = post.getUser().getId();
//					Optional<User> userOpt = userRepo.findById(userId);
//					User user = userOpt.get();
//
//					user.setAbusiveContentNo(user.getAbusiveContentNo() + 1);
//
//					if (user.getAbusiveContentNo() == 1) {
//
//						postService.deletePost(post);
//						emailService.sendEmailForBadWords(user);
//						// send EMail
//					} else if (user.getAbusiveContentNo() == 2) {
//						// suspendUser
//						List<Post> postsOfUser = postRepo.findByUser(user);
//						for (Post postOfUser : postsOfUser) {
//							postService.deletePost(postOfUser);
//						}
//						user.setSuspendUser(true);
//
//					}
//
//					userRepo.save(user);
//				}
//			}
//			postRepo.updatePostUnCheckedContent();
//			userRepo.updateWelcomeStatus();
//			logger.info("close Job end");
//		} catch (Exception e) {
//			logger.error("closeJobs", e);
//		}
//	}

	private Integer getRecommendedPostSum(Post post) {
		return ((post.getNumberOfViews() / 10) + (commentRepo.findByPost(post).size()+ (post.getLikePost() - post.getDisLikePost())));
	}

	public boolean containsAbusiveWords(String content) {
		List<String> abusiveWords = listOfEncryptAllAbusiveWords();
		for (String word : abusiveWords) {
			if (content.toLowerCase().contains(EncryptionUtils.decrypt(word).toLowerCase())) {
				return true;
			}
		}
		return false;
	}

	public List<String> listOfEncryptAllAbusiveWords() {
		return Arrays.asList("2a64XtaOR2SFEa+4UkwvJw==", "OIL8+DIfoG06GNajr2ZKew==", "Xc/8V2OUc5GCi6JHK7iKLw==",
				"xEsYhoXBW1kSydFi5FJheQ==", "1ZjUVtyaGKYJglIaQmOcLA==", "uIIb9RVJMLc9VFl9yAtayQ==",
				"SDNxlccslXtEBSsA+QASaQ==", "kASF+TpM/erM+VV9Ttg17Q==", "A0D7GPZ2orlERjM2VPwDXg==",
				"Em8UnjDBXWF+0kuQff7/dA==", "bc1ipHNAvvKiG7gCreIfIw==", "RBYMntr/Xx6vHRuZccIBeQ==",
				"zqOmsLRH/eQoGF+jzPnUCA==", "yqin1/Vx0p0DsJ9nompQoQ==", "CIrErRQ4v944V14BpXUSVQ==",
				"WkweQCbC8DXET9hryBUKaw==", "GmPsprz2W190D0V2mgtTMA==", "QE4yVwrHTcJSNN9XIp6Uzw==",
				"Y1XstCgirDQTFp93BXBgfg==", "e15vAz0LlEU76wMWY+DGDA==", "EAxDN88088ydq9mjE4rRsQ==",
				"KhLvXGVsxgr31S1XG2cQsQ==", "O7pbINjy/K/Mef3ofNKe0w==", "iVj/WKaoBSFpO6uX0/wFSw==",
				"ImyPfFDZnsIUBUn4jnBhjaW47KhRqgHhfUjwSUxmoVo=", "JdRqmn1Eu1mmogOeOU+C8A==", "LBdbcRhb0BRPu1JAve0GVg==",
				"Rz9u+Xk1vshZMu5M+mW20w==", "+4xifYRujYh03sLig6CBLg==", "vgWfLqYB34WTE4/RoCeI4Q==",
				"GE62hdNylSr03r0MK2SLzg==", "oRRJPMpvOdMnGJZcNZAQlg==", "i0cMwnKoUETWoMtKsF+iMw==",
				"reApB/a1eh5hAhD3jP0Wxg==", "FvY1TUfuD+3lE63W80ztHQ==", "6sqX/G6smQtG6xRui4LP1Q==",
				"SAnqR3f8kHqL/6+fEm53dg==", "kJmlIqwB80zzmpjCQbJrlA==", "oRRJPMpvOdMnGJZcNZAQlg==",
				"x04Gv59kYpNu4EvrVRg/ow==", "hbEUW0Pmfn8orgvJgxgwyQ==", "hgJ2NKRn5mrjO7l+/1yPlw==",
				"zAzbEZgArauB2gTqDrrtrA==", "MqYMDm/XH9ZQL7MHZ5Yb8g==", "8HVOTttI2s78BEBQq1w9Zw==",
				"CIThVcKxW7KiYDwSiXKcIw==", "LPrI9Obxz8aXecckghvd/A==", "q80QTI6FtZsLxIB1dhr1kQ==",
				"EXHZP0dVjSbKa591ugy0dQ==", "Fo7uZHweRZ3pB8ubXD3XwQ==", "Q40KeihTMgepg4HZQNsjDA==",
				"uwd2NJR7TbdxqZtbwM0ziw==", "ykBIibIEa0BHj+sf5yiOVA==", "Q40KeihTMgepg4HZQNsjDA==",
				"uwd2NJR7TbdxqZtbwM0ziw==", "lzoFz6l2Z6UN/6aoZrQYtQ==", "Q40KeihTMgepg4HZQNsjDA==",
				"5SUSvX31GPelAq98KrxBBA==", "VKw/mVL5jLkVRJ0/5x8OGHtrG0ei44kk2uWY8S0Qs6E=", "am8lkQDXySVKGu+5sWGx2Q==",
				"TLfuvL3k+iXHcd7AWBTbbA==", "Gp86QMWoRqztmO8QJdsmpAEZ41OGbmTQPKew0LFE0tw=", "am8lkQDXySVKGu+5sWGx2Q==",
				"z0SWG1uN9cNGXDoofZFbEw==", "iFKdezvSTGTBIOxekNErsntrG0ei44kk2uWY8S0Qs6E=", "am8lkQDXySVKGu+5sWGx2Q==",
				"kMn1Gvw8jRohlcsRMsCAmg==", "iFKdezvSTGTBIOxekNErsntrG0ei44kk2uWY8S0Qs6E=", "am8lkQDXySVKGu+5sWGx2Q==",
				"xjMYW/hhh6J4YnD5rmToUA==", "VKw/mVL5jLkVRJ0/5x8OGHtrG0ei44kk2uWY8S0Qs6E=", "am8lkQDXySVKGu+5sWGx2Q==",
				"q80QTI6FtZsLxIB1dhr1kQ==", "d95mC3XYPf97vf7JnpIjIA==", "VKw/mVL5jLkVRJ0/5x8OGHtrG0ei44kk2uWY8S0Qs6E=",
				"am8lkQDXySVKGu+5sWGx2Q==", "tXV9ynXUgg+ljXb/xuob8Q==", "vFwrsMzxNvqTp7rGhFIjyw==",
				"liyR7YtgiJe9ZVxDj0pgcw==", "yCV48HuyBZgb9sgif8vvBg==", "vFwrsMzxNvqTp7rGhFIjyw==",
				"liyR7YtgiJe9ZVxDj0pgcw==", "+fEFQjcWG06Etx5XL+iy7Q==", "MlyB5cXATSWAp/2hxHQjzEAV+O1oxHcjXzGpw5LO1H4=",
				"ukhZ76JkmAZPSxyWjIwfRw==", "JVaC7w8pI6L2Fe0c1Vd5zQ==", "6GjVYE5ETRUZ1PhARLk8X3lIhw4jpGVuzTaQnkSft/I=",
				"bQ9WZVh0yeAH28p9RS3Qig==", "AEpq6wx+a9QJvGgiEmDH3g==", "6GjVYE5ETRUZ1PhARLk8X3lIhw4jpGVuzTaQnkSft/I=",
				"bQ9WZVh0yeAH28p9RS3Qig==", "pCXSdRVSgRPKNygUQHN2bA==", "6GjVYE5ETRUZ1PhARLk8X+Oqh1v9ZDZLqrDUNi9rz4w=",
				"bQ9WZVh0yeAH28p9RS3Qig==", "6aR5JuSLAzW2TbMquXJTDA==", "6GjVYE5ETRUZ1PhARLk8X+Oqh1v9ZDZLqrDUNi9rz4w=",
				"bQ9WZVh0yeAH28p9RS3Qig==", "UcumAbeQrJPB5qCg4RghPQ==", "jlcGOY9sp7abDgfJ+qDmDVupAgt2KmXVsaC3iuujISw=",
				"k6OtPapOmVytAtOoWVERUQ==", "gZxHbohibPYgSZ9aeeqoQA==", "jlcGOY9sp7abDgfJ+qDmDVupAgt2KmXVsaC3iuujISw=",
				"k6OtPapOmVytAtOoWVERUQ==", "y/GR7/JiTsK8vTYVpN2rDA==", "jlcGOY9sp7abDgfJ+qDmDVupAgt2KmXVsaC3iuujISw=",
				"k6OtPapOmVytAtOoWVERUQ==", "Mfa2pSCPmJKsf6flcstZhQ==", "jlcGOY9sp7abDgfJ+qDmDVupAgt2KmXVsaC3iuujISw=",
				"k6OtPapOmVytAtOoWVERUQ==", "IzZIHGe4q94yuxD0x3KBaA==", "jlcGOY9sp7abDgfJ+qDmDVupAgt2KmXVsaC3iuujISw=",
				"k6OtPapOmVytAtOoWVERUQ==", "X/vqoekyIuSZEnx7Y1V/eA==", "jlcGOY9sp7abDgfJ+qDmDVupAgt2KmXVsaC3iuujISw=",
				"k6OtPapOmVytAtOoWVERUQ==", "rnmQMPKqmthw800kBmTYUA==", "+HzucErrUm8/UzXY78VpXQ==",
				"GhNluWJjSWVhl5eUguWJPg==", "hNdjuXhIiDN6cJYnxig+JQ==", "+HzucErrUm8/UzXY78VpXQ==",
				"GhNluWJjSWVhl5eUguWJPg==", "cdO5vpQmoaGapG8hEiu4Hg==", "CU0Rsw0XrDfUPxUfaT1DHA==",
				"GhNluWJjSWVhl5eUguWJPg==", "b1zyCTWPszB060kC3+/JpA==", "CU0Rsw0XrDfUPxUfaT1DHA==",
				"GhNluWJjSWVhl5eUguWJPg==", "Kk3xky9QmGBEmsBH72Tzlg==", "CU0Rsw0XrDfUPxUfaT1DHA==",
				"GhNluWJjSWVhl5eUguWJPg==", "CgXLWKez8FQ8BsogGrVOZA==", "CU0Rsw0XrDfUPxUfaT1DHA==",
				"GhNluWJjSWVhl5eUguWJPg==", "0tXGYCG8/a9WW2zhhsUl1g==", "9QJqix4wnxZ5hYvGWXFDq3lIhw4jpGVuzTaQnkSft/I=",
				"N391cLsIyWQhTu3PmsBZ1w==", "5KW8ghsRCANeDMnY5D3c1g==", "9QJqix4wnxZ5hYvGWXFDq3lIhw4jpGVuzTaQnkSft/I=",
				"N391cLsIyWQhTu3PmsBZ1w==", "RBRF0/4U4jz7SspiXaOv3g==", "9QJqix4wnxZ5hYvGWXFDq3lIhw4jpGVuzTaQnkSft/I=",
				"N391cLsIyWQhTu3PmsBZ1w==", "Xx01PlELwH0Si5MLKRpiRw==", "9QJqix4wnxZ5hYvGWXFDq98jWahKl7t5AhzqQv/NUvY=",
				"pW3f94TYoZifzVgrigkZIg==", "YHJ8YWZJZHKMuBbHbAlx5w==", "9QJqix4wnxZ5hYvGWXFDq98jWahKl7t5AhzqQv/NUvY=",
				"pW3f94TYoZifzVgrigkZIg==", "DIK7aDxPr9Rjmf+w8+XJNA==", "9QJqix4wnxZ5hYvGWXFDq3k2Cme3AyJ//6o7pOZNofA=",
				"4g2d1+k4HG6bgcrYC8k6JfX31FKutQL9hsa0lJm4L4w=", "AJUsTUlIWQoYqwPPLMlb+Q==",
				"9QJqix4wnxZ5hYvGWXFDq7F4Pc2sFcTO23yj8BjBqN8=", "RqeSvekeSoiTo/HEia6YlCIYx9JWWvtQuq7GmFAwnAA=",
				"MaTAbk3ntod/GCPelur2pQ==", "9QJqix4wnxZ5hYvGWXFDq5yWAyOzDf4FSwLE3kS3vhg=",
				"RqeSvekeSoiTo/HEia6YlCIYx9JWWvtQuq7GmFAwnAA=", "KzB8dREE9kaAd0AQkJZyPA==", "0dgznIAnfYSpvbE9AwaEnA==",
				"CpAiHualVS8eYj+X4VpZDQ==", "7RP655CJLzuBiHis6+fOIQ==", "0dgznIAnfYSpvbE9AwaEnA==",
				"CpAiHualVS8eYj+X4VpZDQ==", "/bnBUJExy8zsBFXS4GhYwg==", "M4m0345Eg99Vem4L//iy/w==",
				"CpAiHualVS8eYj+X4VpZDQ==", "t9AJr/Z+WSUOvA8uziYIsg==", "M4m0345Eg99Vem4L//iy/w==",
				"CpAiHualVS8eYj+X4VpZDQ==", "AcdnsMQ56bCv48+qGDjJfQ==", "cqxicEcnQZWKqM4Ytn9FGA==",
				"N391cLsIyWQhTu3PmsBZ1w==", "P+ZSS/YPDYu6NQd7jcLkGg==", "cqxicEcnQZWKqM4Ytn9FGA==",
				"N391cLsIyWQhTu3PmsBZ1w==", "QHRsuMWm1C/5S8rzIkY9bw==", "cqxicEcnQZWKqM4Ytn9FGA==",
				"N391cLsIyWQhTu3PmsBZ1w==", "ANeZpa8hQ61RVA7hfh7rmw==", "cqxicEcnQZWKqM4Ytn9FGA==",
				"N391cLsIyWQhTu3PmsBZ1w==", "/u5UtcNnTWGjmU9Frk83Rg==", "ZuLcpEbyUeqZOnKuRM8F8Q==",
				"fgaIhWqEElvGg9D58cNc8w==", "VuL1zImzSfaZE2fAr+ulLg==", "JtZ/2deHF93yn0pIOnAL4g==",
				"pm+xYi+PSW+b71N65ANoJQ==", "AVDuKDGB6f8rfiJOJiRfDA==", "2goybtwtzb62MTdFB+3Icg==",
				"RUXtjhmSp2TGpN+iyLLpfQ==", "+CUU5j+ad/C3aSKaPzaBfQ==", "gbv+4hT5p9h36ttZ1i5czg==",
				"RUXtjhmSp2TGpN+iyLLpfQ==", "UYOVagjiqTI6qzLYmEMaRQ==", "etpgH2gEu9BiK2K7YE9o+A==",
				"PC1FTh6/VExqg317NR10Ew==", "K/5W4PcFPMj2snxLrJ4teQ==", "etpgH2gEu9BiK2K7YE9o+A==",
				"tnuiGp7jq6FXOD1sfgL8lQ==", "Q+XCaW3YFSFnT+9JnbtQPg==", "etpgH2gEu9BiK2K7YE9o+A==",
				"AjJ/umA8JLxXsH4VBL46Cw==", "utfK3yQKVXddq0M9dk7lgw==", "ucCi8Wpg3VkGxQu+r639Vw==",
				"PXJVf29YDe5F4EMvq3njkQ==", "zWAFQSRNxpYm/n1lBs+qdg==", "ucCi8Wpg3VkGxQu+r639Vw==",
				"PXJVf29YDe5F4EMvq3njkQ==", "DjZGalaTQQ01Y09RB842ig==", "wVaHFYKen7YkFiGDj607BA==",
				"AjJ/umA8JLxXsH4VBL46Cw==", "3O2g2WKs7NeoamyYLbU9Ag==", "wVaHFYKen7YkFiGDj607BA==",
				"AjJ/umA8JLxXsH4VBL46Cw==", "Cjc41JMVhXhy9rwiuvU8yw==", "wtpb8+446X+4NoJhfXGCNFw4bZakxBg6Icor8Whdu4Y=",
				"ibnqJzTHofqowCnK/RPe2g==", "zBO4CX5e37EdlSXVhrZ2KA==", "wtpb8+446X+4NoJhfXGCNFw4bZakxBg6Icor8Whdu4Y=",
				"ibnqJzTHofqowCnK/RPe2g==", "rpyU639KFROcUgLtKvU0bg==", "fBIpowSjXtDhut23u9Mijg==",
				"1N97JiLCvpX2cfWZhvQc+Q==", "SxyRS+RKe+DMMgjqojJx4w==", "UvA3FdbU8rLmE2D+FgUlqg==",
				"N391cLsIyWQhTu3PmsBZ1w==", "Yg+No3JyikmYhwbIBGCM5w==", "UvA3FdbU8rLmE2D+FgUlqg==",
				"N391cLsIyWQhTu3PmsBZ1w==", "5fZF7YkjVt0jNl6ocPrCew==", "UvA3FdbU8rLmE2D+FgUlqg==",
				"N391cLsIyWQhTu3PmsBZ1w==", "FjkxL+7QEmGORifE0LnATw==", "uA70CAXXCoGISZM/SCtzT3lIhw4jpGVuzTaQnkSft/I=",
				"N391cLsIyWQhTu3PmsBZ1w==", "smTCTwEA3dDeCF5gmdXXpA==", "jbHj6CdYnyszIXIRjg+V63lIhw4jpGVuzTaQnkSft/I=",
				"N391cLsIyWQhTu3PmsBZ1w==", "dPhki4uLmYbj0EZFg49+Ig==", "PHuZC6t3Yi/PKdQT91HC+g==",
				"GhNluWJjSWVhl5eUguWJPg==", "dxZZqarkqQKrSl2me4E+xQ==", "PHuZC6t3Yi/PKdQT91HC+g==",
				"GhNluWJjSWVhl5eUguWJPg==", "5eNdXacI3GMjRKdUVkz5+g==", "HG5a4eGAlOAkbpIGZkrLUw==",
				"GhNluWJjSWVhl5eUguWJPg==", "7gs/Fdcxny6T9BpMNS1xxQ==", "HG5a4eGAlOAkbpIGZkrLUw==",
				"GhNluWJjSWVhl5eUguWJPg==", "NTWcbqtYVDI+AyBsG3TBiQ==", "XZZidRMbmxoH+cgdxI1dyA==",
				"nmAARMfpMmTI7F/HSigrDQ==", "/eWLg85ocVKRvbIZTAHIJA==", "RfXF6Z+hDL3tVL6A6tnVbA==",
				"/ymp0IeI/0fQt2BE9333AQ==", "G2oKasVxNG+c3uiPSsAeGg==", "qCPk+m5KVf6abpkT7kOegg==",
				"/ymp0IeI/0fQt2BE9333AQ==", "Z3d6OgiSPzhEAqXqlmK3/A==", "hX6VyAgD6A+IUQ4tGNkvvTBg3QXuUSAAb8pUhafTYT8=",
				"ElT/XDtaxAwfiWtB8zIhvQ==", "atvezbHSm6lM7xlbx/nPkA==", "LyIePZXR8VG02A7r5GIF9g==",
				"DRUo/hbz1oZ9pXIRjVHJqA==", "2I6GrDKMF8aL7uOy5x/d4A==", "LyIePZXR8VG02A7r5GIF9g==",
				"DRUo/hbz1oZ9pXIRjVHJqA==", "1pPyuOhAk6ja8OuzuSpq/g==", "ybQdrQIEiQ2x3lB/dMwsXw==",
				"yIJ2KWETHLtS7zVMXNlGXQ==", "izUDa+lqkIXgISjOvvi6qw==", "V0f94DQY4yc6gXFzfdM7HQ==",
				"yIJ2KWETHLtS7zVMXNlGXQ==", "/eghH5qW4M88lutgQeWGXQ==", "V0f94DQY4yc6gXFzfdM7HQ==",
				"yIJ2KWETHLtS7zVMXNlGXQ==", "9bu7br/oS9sXZMNgfGPGHw==", "4v72KQVBg9rPv6cDP410t3lIhw4jpGVuzTaQnkSft/I=",
				"yIJ2KWETHLtS7zVMXNlGXQ==", "3BTrHYl0ncQFrTcLs1De9A==", "4v72KQVBg9rPv6cDP410t+Oqh1v9ZDZLqrDUNi9rz4w=",
				"yIJ2KWETHLtS7zVMXNlGXQ==", "qeQezERBvohOOp5l1VUTSg==", "1uYY2CKhBK71Y+r8K3fZqQ==",
				"42vFMCx562XbGKu4lFDF3w==", "ahWfPZMzmNeqibpU35ECfw==", "1uYY2CKhBK71Y+r8K3fZqQ==",
				"42vFMCx562XbGKu4lFDF3w==", "v2HRq4bQGrdzz25cz5OnnA==", "xtBee8ceIPHt8PlqomNfWg==",
				"Q40KeihTMgepg4HZQNsjDA==", "9fFVI/kMAnnR5Eix2Zj6QA==", "xtBee8ceIPHt8PlqomNfWg==",
				"Q40KeihTMgepg4HZQNsjDA==", "I0b9ytanxBE0RfUgTMdAig==", "xtBee8ceIPHt8PlqomNfWg==",
				"Q40KeihTMgepg4HZQNsjDA==", "NkpyM2s7u8AD9gUY/XY0Dg==", "ZiFsX3SBbo60PawGAHALsQ==",
				"TdQGgJ4+nCHj380vz9EKnw==", "DTyiiAw1OrtDyz1c68rWRQ==", "dV5h+Scrp4aiz3h5tNumdw==",
				"7v86Abc1ZYh7cBYJEm6euKW47KhRqgHhfUjwSUxmoVo=", "hP8STOu/CgYS6RFJH8GMYQ==", "Juq/boD24Jg9u1L4IVC2IA==",
				"TdQGgJ4+nCHj380vz9EKnw==", "9WarxxbcaVscEfAHqS7Y5g==", "Juq/boD24Jg9u1L4IVC2IA==",
				"TdQGgJ4+nCHj380vz9EKnw==", "6kN6vFB+wLvFYxpQeL3c7w==", "ZwMpB93yq/rLhV1nhQLC5Q==",
				"iw0Popjqu5AdQYC6DYTFvg==", "QHCZWMfI53F0MY7zhJfxxw==", "kbI9V+w1k4YX/HZv3omLP0b4cQmT86aUUhEaZzlp7lY=",
				"iw0Popjqu5AdQYC6DYTFvg==", "qTRiOg1xDiIAF+N8GCFEeg==", "kbI9V+w1k4YX/HZv3omLP0b4cQmT86aUUhEaZzlp7lY=",
				"iw0Popjqu5AdQYC6DYTFvg==", "XcoFzvmTHu1TSXQBtuzfbg==", "kbI9V+w1k4YX/HZv3omLP6siQ55/rgtk6R3p4CDGbBg=",
				"iw0Popjqu5AdQYC6DYTFvg==", "eL5zh1NSo8lsD1ZLF3emmw==", "kbI9V+w1k4YX/HZv3omLP6siQ55/rgtk6R3p4CDGbBg=",
				"iw0Popjqu5AdQYC6DYTFvg==", "tfDfWscdtfiGusNHBSMEKw==", "kbI9V+w1k4YX/HZv3omLP40dqF3LQqrnaiH2GyB2sBk=",
				"iw0Popjqu5AdQYC6DYTFvg==", "/ZskvXm0taq0gwXFDvlx7w==", "kbI9V+w1k4YX/HZv3omLP/YZdRaY+PJNr8bFWrRTHOQ=",
				"iw0Popjqu5AdQYC6DYTFvg==", "K2bCyYtpYyvFCIB3zf0xoA==", "8SQbNiGx6NSd5VhHn3+nbeQOFJ9RcsV/9TnwR2F88qg=",
				"JvyDU+4E3Zb1nvssJNyRPw==", "I51S8RiZ4glm5K3uTXoYYg==", "8SQbNiGx6NSd5VhHn3+nbeQOFJ9RcsV/9TnwR2F88qg=",
				"JvyDU+4E3Zb1nvssJNyRPw==", "poxXJLjLsuSpN3WB6nT/gQ==", "KoDxi1pMvSc6lCxkpUMDhQ==",
				"YJM/N698ReSzjh4tgNoUfw==", "ALqYbbkEB8LbGXdtf+94+g==", "KoDxi1pMvSc6lCxkpUMDhQ==",
				"YJM/N698ReSzjh4tgNoUfw==", "JRepdOFqLWZiMoeUcbUJdg==", "y1rvtC9EIoi82dXazFvmfA==",
				"YJM/N698ReSzjh4tgNoUfw==", "PpyKdfr5IV+HaL0902A+sQ==", "y1rvtC9EIoi82dXazFvmfA==",
				"YJM/N698ReSzjh4tgNoUfw==", "zetGH5BB5zFuzTZXQyFwkQ==", "4mJG0EtzrQ7ptC9ZZBeetnlIhw4jpGVuzTaQnkSft/I=",
				"jEvHvIXIM+K6LsU2mxoaww==", "YA4uVGqFYlROTOE+ydIOgA==", "4mJG0EtzrQ7ptC9ZZBeetuOqh1v9ZDZLqrDUNi9rz4w=",
				"jEvHvIXIM+K6LsU2mxoaww==", "e1b3CfPC3P7UbqXnFoez8w==", "4mJG0EtzrQ7ptC9ZZBeetuOqh1v9ZDZLqrDUNi9rz4w=",
				"jEvHvIXIM+K6LsU2mxoaww==", "zOeSAKV3wCnR/B4hZAKDpA==", "yBteJdC/TIEMmhEFeLD3RnlIhw4jpGVuzTaQnkSft/I=",
				"I9IHqcB6Veye7M5vfhZCog==", "y9hsSROcIXkXQDKeBbWtSw==", "yBteJdC/TIEMmhEFeLD3RnlIhw4jpGVuzTaQnkSft/I=",
				"I9IHqcB6Veye7M5vfhZCog==", "lIM4L3csklV+lPWKvB5xTQ==", "yBteJdC/TIEMmhEFeLD3RnlIhw4jpGVuzTaQnkSft/I=",
				"I9IHqcB6Veye7M5vfhZCog==", "U74nT2WdLbFdHpLN5qXfvw==", "4mJG0EtzrQ7ptC9ZZBeetkAV+O1oxHcjXzGpw5LO1H4=",
				"I9IHqcB6Veye7M5vfhZCog==", "tjEXJMf5IPKQ8QssmlCuSA==", "Qj69zHIijLZwSioxnTmEtw==",
				"Npje9nS8PwinSegXrD820A==", "ktVpxasvxJ5zyyR1uWVk8w==", "Qj69zHIijLZwSioxnTmEtw==",
				"Npje9nS8PwinSegXrD820A==", "1piZt2PzzCuZLUQjCGR7Sw==", "sXvQ06DffpsCl7sgKgsUWw==",
				"gbLW7kvURdVqh5rM8Ygntw==", "x7AsDjjazpe+I+cGZ+u9/g==", "fGO/DNrUUrrf78vLy3AsiQ==",
				"gbLW7kvURdVqh5rM8Ygntw==", "YT/3oNEELIpDx0lFM5FHIQ==", "V9t7BO94AD0Y4y67AbCBkQ==",
				"gbLW7kvURdVqh5rM8Ygntw==", "rgWPp8/PSdMeooQjxNO8EA==", "LtPC3AkQDhalN2TDQcDzjQ==",
				"gbLW7kvURdVqh5rM8Ygntw==", "OY9uOXDigF1kAcXWmeshDA==", "rTPC7YChEAODNEwtSNeB1Q==",
				"gbLW7kvURdVqh5rM8Ygntw==", "405yJvMxT8ESYkpp9hIh4w==", "axIf4D6/pFwdy4ud/CP0NQ==",
				"gbLW7kvURdVqh5rM8Ygntw==", "qNXoydbNzJnsSiPlzlVRTw==", "nFNSpYVjJShJ1HKQf12qcQ==",
				"gbLW7kvURdVqh5rM8Ygntw==", "FFfkQXe+fKYavR8bK1qE7w==", "/3aWHMdniBrM9EBYFJFkmA==",
				"gbLW7kvURdVqh5rM8Ygntw==", "C0xHMLTT5fq85Y1275lCcw==", "818Tw7hmpsKWtmeHqiYsBA==",
				"gbLW7kvURdVqh5rM8Ygntw==", "9Y3jO2pF8lWv5l3rDlMmyQ==", "DJKVpYVUPqXIgfT2jJXcIA==",
				"gbLW7kvURdVqh5rM8Ygntw==", "rN94U0gu54FeppcYfmFAjA==", "0RX6KZjLIBLHSLAiAEckLA==",
				"gbLW7kvURdVqh5rM8Ygntw==", "15BW7LC1UzSN0+Yl1PxWFg==", "0RX6KZjLIBLHSLAiAEckLA==",
				"gbLW7kvURdVqh5rM8Ygntw==", "UDGbCi2e3bxmN8IqoL2ebg==", "hLHox0VtM2vAmIeMkAcAWQ==",
				"3KUqoePMqXk9bqZqPPdHXg==", "pZwlsL48ylIV2pVKV8xK2A==", "hLHox0VtM2vAmIeMkAcAWQ==",
				"3KUqoePMqXk9bqZqPPdHXg==", "A/86sEC1cZ9mgja1sR0Kgw==", "ctXD+dhSpv6ihHw8q/j0JXqeR+OjyV4/DeRRxRLWORE=",
				"3KUqoePMqXk9bqZqPPdHXg==", "8Lp92ANqc3A4ptRW8gkZ9Q==", "ctXD+dhSpv6ihHw8q/j0JXqeR+OjyV4/DeRRxRLWORE=",
				"3KUqoePMqXk9bqZqPPdHXg==", "CMNal0FMJJ9k9On1e6A2iA==", "hcPWMexGecDbxzglfT/+nEAV+O1oxHcjXzGpw5LO1H4=",
				"t7nI+XDEkGqdDN/FfbP1sw==", "7U8BZhQ0LP7U90TkEoAv6w==", "ZXqSsm4u9A4Be+wAodRETA==",
				"5usUGpGfXDIYokqa4WAl5Q==", "tAo3zGrHS2PnK1wK5rjwdA==", "BgPMejQ1nVvagI3i/N/3Jw==",
				"+gUcEYGrKEYD2gK73UD7YA==", "JpDMK3y2L4pMGZS4G2LAqA==", "MGBI1T3gGKPqYABYWM62Qr54ARl3g8GhMVL0V2HPyPk=",
				"P6Vn6J6l9lsSyvjt0oQHfw==", "jKfVsiS84z7IXCea6bishw==", "b7GuIGVS1Mgxuf0wMkp7DLS+UU7FnsdzcDdtceAaiTU=",
				"+R1A8i7crywvDWwDy/wbCg==", "o1agAAQ4KjYhTFafrIrOdw==", "b7GuIGVS1Mgxuf0wMkp7DLS+UU7FnsdzcDdtceAaiTU=",
				"+R1A8i7crywvDWwDy/wbCg==", "imC6B1vVYga/z3Q0p0B/MQ==", "b7GuIGVS1Mgxuf0wMkp7DLS+UU7FnsdzcDdtceAaiTU=",
				"+R1A8i7crywvDWwDy/wbCg==", "ZuLaMeDt697NS1qOWuM47A==", "b7GuIGVS1Mgxuf0wMkp7DDuJHGD0QE9HAXYeRtEs/Lk=",
				"QE6gh/mXQxl86J4DtPCXzA==", "iadJaMgwlJtATv/LGAhmzA==", "b7GuIGVS1Mgxuf0wMkp7DCzAJR9TA+dPq2UQKGWIEko=",
				"QE6gh/mXQxl86J4DtPCXzA==", "jtnvCWH8LBAIub8S1go4EQ==", "b7GuIGVS1Mgxuf0wMkp7DLS+UU7FnsdzcDdtceAaiTU=",
				"+R1A8i7crywvDWwDy/wbCg==", "PbtVfHPJd6M25SZJ+F308Q==", "b7GuIGVS1Mgxuf0wMkp7DLS+UU7FnsdzcDdtceAaiTU=",
				"+R1A8i7crywvDWwDy/wbCg==", "p6it1wfvcVbNjIOA1Pgb/A==", "Bb+Lw+u5FBcn/vp+j9OCsg==",
				"CpAiHualVS8eYj+X4VpZDQ==", "BVCMCJg2uzymVI7Cp5rEtQ==", "Bb+Lw+u5FBcn/vp+j9OCsg==",
				"CpAiHualVS8eYj+X4VpZDQ==", "5Xcu5ubNoCSth1HEXXNXwA==", "fYPh34rFFjLGJVWWyQ7BfA==",
				"t/qBxS1c9BOXWCDB3D7jmg==", "LzRkYm0JU5Mi+eE3OKRVFg==", "JWohg7QsvNjsrAVKZeCrmg==",
				"t/qBxS1c9BOXWCDB3D7jmg==", "b4kD8BXTUYdd5a9ZbhOJFA==", "bbF4pM2hK6RsTBvszCBWdA==",
				"mwxrZv7PQ9o5UciKBtsxjg==", "1gC6hYh5yz39WqEjDUFp9A==", "opvgbaIpjLWw8M/9/udihQ==",
				"mwxrZv7PQ9o5UciKBtsxjg==", "NsDecuWM6bR2b1VFzwZWfg==", "B9wwBvxZ45W4KZ/xT1bgvw==",
				"tGl1NWKy/Usw4wgaYXpnwg==", "IlPLzFnT2/NzokSCcd8TtA==", "QlDYMsX7pcIGXe2Uz4J3TQ==",
				"tGl1NWKy/Usw4wgaYXpnwg==", "76M23BXpbTfRLsHlqNopUQ==", "UsMLvEwsH7CzwLgUqwY7PQ==",
				"lgJSQmKoBWa2thaTUHdsqhgu8si9bA1slYOqADn/IpM=", "zWo4XQOom1v6z7TXcJ7d7Q==", "nLs74DG9Bi97Qm5yfBk8NA==",
				"lgJSQmKoBWa2thaTUHdsqhgu8si9bA1slYOqADn/IpM=", "D5DKJqOfxaG99d6yM5wkvA==", "w1aIbRU+6DD7hKP/S89gVg==",
				"k6OtPapOmVytAtOoWVERUQ==", "ZKw+TbdUScp8BoMwoe+AGg==", "w1aIbRU+6DD7hKP/S89gVg==",
				"k6OtPapOmVytAtOoWVERUQ==", "DOUpWVCbPGOZxVPNHGjE3g==", "zZPOh1NoZ/Yswh5lp82NfQ==",
				"VmU2PIN6phNpnH7MXAkjCA==", "/yLPEBxGHLvm/TWjbCaztA==", "zZPOh1NoZ/Yswh5lp82NfQ==",
				"VmU2PIN6phNpnH7MXAkjCA==", "FreWN9jDLphOk04qO4qLKA==", "IsoM1yYd/04gvV95H1Z/Cg==",
				"VmU2PIN6phNpnH7MXAkjCA==", "2RlqqKNhjAdFwC3rqWy/bw==", "IsoM1yYd/04gvV95H1Z/Cg==",
				"VmU2PIN6phNpnH7MXAkjCA==", "JkGSYb2k6Subsui6M0i6Qg==", "/jT15hJ7XLCZzrKU44D4S3lIhw4jpGVuzTaQnkSft/I=",
				"f0aP9x2FWwayz7dTqMz2tA==", "2KoXYESYhlB/q9cFVU77Lg==", "/jT15hJ7XLCZzrKU44D4S+Oqh1v9ZDZLqrDUNi9rz4w=",
				"f0aP9x2FWwayz7dTqMz2tA==", "2xqGlUS9Y8XI+M9vCkztlQ==", "/jT15hJ7XLCZzrKU44D4S+Oqh1v9ZDZLqrDUNi9rz4w=",
				"f0aP9x2FWwayz7dTqMz2tA==", "o5mHrNucq2X7/cA+JAH55w==", "/jT15hJ7XLCZzrKU44D4S+Oqh1v9ZDZLqrDUNi9rz4w=",
				"f0aP9x2FWwayz7dTqMz2tA==", "dk9oqOIjTxgRFLgMSKtX0A==", "hSZ0F2GaULW5b25/1dCrNw==",
				"VmU2PIN6phNpnH7MXAkjCA==", "hMVahLjzafqv6N/U4pGPqg==", "hSZ0F2GaULW5b25/1dCrNw==",
				"VmU2PIN6phNpnH7MXAkjCA==", "cIiP0yq/pJRuU1fIUfWISw==", "IiuliSyJ37uRxVBWcKpjono4BeolYStJL+s2CESPfzE=",
				"e40uSt2IVgvcjFJbQtRjyw==", "X+7QUmiVajO2NckKwhlVrrR/nk34I57p/UZQRoTruqo=",
				"iiNHgsLXu+MvQ5T8Be1VL9LESY/US/asXPLDAyq15g4=", "p6eyqQ1b0uY5kFb6z4vB0g==", "AqJsU1PQLWEYU76wvGS5OA==",
				"CaO5SDkKKGZgOQZjeu3WVg==", "HCf49jPkJaM+4dyCTaoRzw==", "AqJsU1PQLWEYU76wvGS5OA==",
				"CaO5SDkKKGZgOQZjeu3WVg==", "WwuHPwteBaQeorZ267YycQ==", "Uv4FSvj4Akibaqv+d/lM0Q==",
				"CaO5SDkKKGZgOQZjeu3WVg==", "7S1uPcgeB+p3TiOoTfaU/w==", "Uv4FSvj4Akibaqv+d/lM0Q==",
				"CaO5SDkKKGZgOQZjeu3WVg==", "bLbvX+V+1jjUrICYqXu7Pw==", "Ft4Kx2nWge83vdXKyzrVCw==",
				"pnEEBWE4SQiVyDdoojehzQ==", "bLbvX+V+1jjUrICYqXu7Pw==", "FnHOB4cf8ibAkEERiijMTg==",
				"pnEEBWE4SQiVyDdoojehzQ==", "2Uzua3l9mvUat7YRUIZY9w==", "wUiB4DHru4eM+yp3zPYU/g==",
				"Co2lwdcANTxVJJ23dPNTDQ==", "MOtgTUerRDxQRuMRF0PP/A==", "yLCj2+MAACqTBDXgZ2Wycg==",
				"Co2lwdcANTxVJJ23dPNTDQ==", "c3zKOQHcRt4ob8vATY6rRQ==", "yLCj2+MAACqTBDXgZ2Wycg==",
				"Co2lwdcANTxVJJ23dPNTDQ==", "2O6Wea6V18snvCAoTghe1w==");

	}

	public User dtoToUser(UserDto userDto) {
		return this.modelMapper.map(userDto, User.class);
	}

	public UserDto usertoDto(User user) {
		return this.modelMapper.map(user, UserDto.class);
	}

	public Role getByUserType(UserType userType) {

		return roleRepo.findByUserType(userType.toString());
	}

	public ResponseModel googleSignUp(String code) throws GeneralSecurityException, IOException {
		if (code != null) {
			// 30-June-2022 @manish get id token from credential
			// first verify credential code with google then it will return us id Token.
			// id token contain all user information.
			GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
					new GsonFactory())
					// Specify the CLIENT_ID
					.setAudience(Collections.singletonList(clientId))
					// Or, if multiple clients access then:
					// .setAudience(Arrays.asList(CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3))
					.build();
			// verify google jwt code
			GoogleIdToken idToken = verifier.verify(code);
			if (idToken != null) {
				// get user details from payload
				Payload payload = idToken.getPayload();
				String userEmail = payload.getEmail();
				String name = (String) payload.get("name");
				if (userEmail != null && !userEmail.isEmpty() && !userEmail.equals("")) {
					UserDto userDto = new UserDto();
					userDto.setEmail(userEmail);
					userDto.setName(name);
					userDto.setPassword(EncryptionUtils.encrypt(JavaHelper.generateRandomPassword(10, 97, 122)));
					userDto.setAbout("Google User");
					return createUser(userDto);

				}
			}
		}
		return new ResponseModel("Error occur while user signup", HttpStatus.BAD_REQUEST, true);

	}
}
