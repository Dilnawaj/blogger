package com.codewithmd.blogger.bloggerappsapis.controllers;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.text.ParseException;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.codewithmd.blogger.bloggerappsapis.account.model.LoginModel;
import com.codewithmd.blogger.bloggerappsapis.exception.ResponseModel;
import com.codewithmd.blogger.bloggerappsapis.payloads.HelpCenterDto;
import com.codewithmd.blogger.bloggerappsapis.services.interfaces.BloggerService;

@CrossOrigin
@RestController
@RequestMapping("/account")
@Validated
public class BloggerController {

	@Autowired
	private BloggerService bloggerService;

	@PostMapping(value = "/login", produces = "application/json; charset=utf-8", consumes = "application/json")
	public ResponseEntity<Object> login(@Valid @RequestBody LoginModel loginModel) {
		ResponseModel responseModel = bloggerService.getLoginModel(loginModel, true);
		return new ResponseEntity<>(responseModel.getResponse(), responseModel.getResponseCode());
	}

	@GetMapping(value = "/google/login/{code}", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> googleLogin(@PathVariable String code) throws GeneralSecurityException, IOException {
		String email = bloggerService.getEmailFromGoogleAccessToken(code);
		ResponseModel responseModel = bloggerService.getLoginModel(email, false);
		return new ResponseEntity<>(responseModel.getResponse(), responseModel.getResponseCode());
	}

	@PostMapping(value = "/reset", produces = "application/json; charset=utf-8", consumes = "application/json")
	public ResponseEntity<Object> resetPassword(@RequestBody LoginModel loginModel) throws ParseException {
		ResponseModel responseModel = bloggerService.resetPassword(loginModel);
		return new ResponseEntity<>(responseModel.getResponse(), responseModel.getResponseCode());
	}

	@PostMapping(value = "/forgot", produces = "application/json; charset=utf-8", consumes = "application/json")
	public ResponseEntity<Object> forgotPassword(@RequestBody LoginModel loginModel) {
		ResponseModel responseModel = bloggerService.forgotPassword(loginModel);
		return new ResponseEntity<>(responseModel.getResponse(), responseModel.getResponseCode());
	}

	@PutMapping(value = "/update", produces = "application/json; charset=utf-8", consumes = "application/json")
	public ResponseEntity<Object> updatePassword(@Valid @RequestBody LoginModel loginModel) {
		ResponseModel responseModel = bloggerService.getUpdatePassword(loginModel);
		return new ResponseEntity<>(responseModel.getResponse(), responseModel.getResponseCode());
	}

	@PostMapping(value = "/help", produces = "application/json; charset=utf-8", consumes = "application/json")
	public ResponseEntity<Object> helpCenter(@RequestBody HelpCenterDto helpCenter) {
		ResponseModel responseModel = bloggerService.helpCenter(helpCenter);
		return new ResponseEntity<>(responseModel.getResponse(), responseModel.getResponseCode());
	}

	@GetMapping(value = "/updatepasswordalert", produces = "application/json; charset=utf-8")
	public ResponseEntity<Object> updatePasswordAlert(@RequestHeader Integer userId) {
		ResponseModel responseModel = bloggerService.updatePasswordAlert(userId);
		return new ResponseEntity<>(responseModel.getResponse(), responseModel.getResponseCode());
	}
}
