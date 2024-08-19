package com.codewithmd.blogger.bloggerappsapis.admin.services.impl;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Optional;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.codewithmd.blogger.bloggerappsapis.account.entity.ClientRole;
import com.codewithmd.blogger.bloggerappsapis.account.entity.Role;
import com.codewithmd.blogger.bloggerappsapis.account.model.LoginModel;
import com.codewithmd.blogger.bloggerappsapis.account.model.UserType;
import com.codewithmd.blogger.bloggerappsapis.account.repo.ClientRoleRepo;
import com.codewithmd.blogger.bloggerappsapis.account.repo.RoleRepo;
import com.codewithmd.blogger.bloggerappsapis.account.service.ClientRoleService;
import com.codewithmd.blogger.bloggerappsapis.admin.payloads.AdminDto;
import com.codewithmd.blogger.bloggerappsapis.admin.services.AdminService;
import com.codewithmd.blogger.bloggerappsapis.config.ErrorConfig;
import com.codewithmd.blogger.bloggerappsapis.entities.User;
import com.codewithmd.blogger.bloggerappsapis.exception.ResponseModel;
import com.codewithmd.blogger.bloggerappsapis.helper.EmailService;
import com.codewithmd.blogger.bloggerappsapis.helper.EncryptionUtils;
import com.codewithmd.blogger.bloggerappsapis.helper.JavaHelper;
import com.codewithmd.blogger.bloggerappsapis.repos.UserRepo;
import com.codewithmd.blogger.bloggerappsapis.services.impl.BloggerServiceImpl;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class AdminServiceImpl implements AdminService {

	@Autowired
	private ClientRoleService clientRoleService;
	@Autowired
	private ClientRoleRepo clientRoleRepo;
	@Autowired
	private EmailService emailService;
	
	@Autowired
	private RoleRepo roleRepo;
	@Autowired
	private ModelMapper modelMapper;
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private BloggerServiceImpl bloggerServiceImpl;
	
	@Value("${clientId}")
	private String clientId;
	private Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Transactional
	public ResponseModel createAdmin(AdminDto userDto) {
		try {

			if (userDto.checkValidationForRegister()) {

				Optional<User> userExist = userRepo.findByEmail(userDto.getEmail());
				if (userExist.isPresent()) {
					return new ResponseModel("User already exist", HttpStatus.BAD_REQUEST, true);
				}
				User user = this.dtoToAdmin(userDto);
				user.setSuspendUser(false);
				user.setGoogleAccount(userDto.getAbout().contains("Google"));

				user.setEmail(user.getEmail().toLowerCase().trim());
				if (JavaHelper.checkStringValue(user.getPassword()).equals("")) {
					user.setPassword(null);
				} else {
					user.setPassword(user.getPassword());

				}

				user.setProfileCreatedDate(JavaHelper.getCurrentDate().toString());
				user.setLinkExpiryDate(JavaHelper.getCurrentDate().toString());
				user.setId(idGenerator());
				user.setVerificationCode(emailService.getFreshVerificationCode());
				user.setWelcomeEmail(false);
				user.setPasswordSet(true);
				if (Boolean.FALSE.equals(emailService.sendEmailForRegisterAdmin(user))) {
					return new ResponseModel("An unknown error occurred.Please try again later.",
							HttpStatus.BAD_REQUEST, true);
				}
				
				this.admintoDto(userRepo.save(user));
				Role role = getByUserType(UserType.ADMIN);
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
	/**
	 * this method will validate user details and return token
	 * 
	 * @param req this will consist login detail of user.
	 * @see LoginModel
	 * @return this method will return access-token and refresh-token with validity
	 *         time second.
	 */
	public ResponseModel getLoginModel(LoginModel req, boolean validatePassword) {

		try {
			if (req.checkValidationForLogin() || !validatePassword) {
				String email = req.getEmail().toLowerCase().trim();
				Optional<User> userOptional = userRepo.findByEmail(email);
				
				if (userOptional.isEmpty() || req.getEmail().isEmpty()) {
					return new ResponseModel("User not found ", HttpStatus.BAD_REQUEST, true);
				} else {
					User user = userOptional.get();
					ClientRole clientRole=	clientRoleRepo.findByClientId(user.getId().longValue());
					
					if(clientRole.getRoleId()!=2)
					{
						return new ResponseModel("Permission denied",
								HttpStatus.BAD_REQUEST, true);
					}
					if (user.isSuspendUser()) {
						return new ResponseModel("your account has been suspended due to inappropriate behavior",
								HttpStatus.BAD_REQUEST, true);
					} else if ((!user.isPasswordSet() && validatePassword)
							|| (!(JavaHelper.checkPassword(req.getPassword(),
									EncryptionUtils.decrypt(user.getPassword()), validatePassword)))) {
						return new ResponseModel("Invalid credentials", HttpStatus.BAD_REQUEST, true);

					} else {
						if (!user.isPasswordSet()) {

							user.setGoogleLoginCount(user.getGoogleLoginCount() + 1);
							userRepo.save(user);
						}
						return bloggerServiceImpl.getLoginModel(user, req.getRememberMe());
					}
				}
			}
		} catch (Exception e) {
			return new ResponseModel("Unexpected error occured", HttpStatus.BAD_REQUEST, true);
		}
		return new ResponseModel("Required parameter missing.", HttpStatus.BAD_REQUEST, true);
	}

	public Role getByUserType(UserType userType) {

		return roleRepo.findByUserType(userType.toString());
	}
	public AdminDto admintoDto(User user) {
		return this.modelMapper.map(user, AdminDto.class);
	}
		public User dtoToAdmin(AdminDto adminDto) {
			return this.modelMapper.map(adminDto, User.class);
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
		@Override
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
						AdminDto adminDto = new AdminDto();
						adminDto.setEmail(userEmail);
						adminDto.setName(name);
						adminDto.setPassword(EncryptionUtils.encrypt(JavaHelper.generateRandomPassword(10, 97, 122)));
						adminDto.setAbout("Google User");
						return createAdmin(adminDto);

					}
				}
			}
			return new ResponseModel("Error occur while user signup", HttpStatus.BAD_REQUEST, true);
		}
		public ResponseModel forgotPassword(LoginModel loginModel) {
			Optional<User> userOptional = userRepo.findByDobAndEmail(loginModel.getDob(), loginModel.getEmail());
			if (userOptional.isPresent() && !"".equals(JavaHelper.checkStringValue(userOptional.get().getPassword()))) {
				User user = userOptional.get();
				ClientRole clientRole=	clientRoleRepo.findByClientId(user.getId().longValue());
				
				if(clientRole.getRoleId()!=2)
				{
					return new ResponseModel("Permission denied",
							HttpStatus.BAD_REQUEST, true);
				}
				if (Boolean.FALSE.equals(emailService.sendEmailForReset(user))) {
					return new ResponseModel("An unknown error occurred.Please try again later.", HttpStatus.BAD_REQUEST,
							true);
				}
				user.setLinkExpiryDate(JavaHelper.getCurrentDate().toString());
				userRepo.save(user);
				return new ResponseModel("", HttpStatus.OK, false);
			}
			return new ResponseModel("Invalid credentials", HttpStatus.BAD_REQUEST, true);
		}
		@Override
		public ResponseModel grantAdminAccess(String emailAddress) {
			
			String email = emailAddress.toLowerCase().trim();
			Optional<User> userOptional = userRepo.findByEmail(email);
			
			if (userOptional.isEmpty()) {
				return new ResponseModel("User not found ", HttpStatus.BAD_REQUEST, true);
			} else {
				User user =userOptional.get();
				
				user.setPassword(EncryptionUtils.encrypt(JavaHelper.generatePassword()));
			userRepo.save(user);
			emailService.sendEmailToClientForAdminRole(user);
			}

			return new ResponseModel("Admin role granted", HttpStatus.OK, false);
		}
}
