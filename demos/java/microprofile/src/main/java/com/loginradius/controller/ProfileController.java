package com.loginradius.controller;

import com.google.common.base.Strings;
import com.loginradius.dto.ResponseBodyDto;
import com.loginradius.dto.UpdateProfileDto;
import com.loginradius.sdk.models.requestmodels.UserProfileUpdateModel;
import com.loginradius.service.LoginRadiusService;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.container.AsyncResponse;
import javax.ws.rs.container.Suspended;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("profile")
@Valid
public class ProfileController {
	@Inject
	private LoginRadiusService loginRadiusService;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public void getProfile(@Suspended AsyncResponse response, @QueryParam("token") @NotNull String token) {
		loginRadiusService.getProfile(token)
				.thenApply(identity -> {
					var uid = identity.getUid();
					if (Strings.isNullOrEmpty(uid)) {
						response.resume(Response
								.status(Response.Status.NOT_FOUND)
								.type(MediaType.TEXT_PLAIN_TYPE)
								.entity("Account does not exist.")
								.build());
						return null;
					}

					return new ResponseBodyDto<>("Profile fetched", identity);
				})
				.thenAccept(response::resume)
				.exceptionally(throwable -> {
					response.resume(Response
							.serverError()
							.type(MediaType.TEXT_PLAIN_TYPE)
							.entity(throwable.getMessage())
							.build());
					return null;
				});
	}

	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public void updateProfile(@Suspended AsyncResponse response, @Valid UpdateProfileDto updateProfileDto) {
		var userProfileUpdateModel = new UserProfileUpdateModel();
		userProfileUpdateModel.setFirstName(updateProfileDto.getFirstname());
		userProfileUpdateModel.setLastName(updateProfileDto.getLastname());
		userProfileUpdateModel.setAbout(updateProfileDto.getAbout());

		loginRadiusService.updateProfile(updateProfileDto.getToken(), userProfileUpdateModel)
				.thenApply(userProfilePostResponse -> {
					if (!Boolean.TRUE.equals(userProfilePostResponse.getIsPosted())) {
						response.resume(Response
								.status(Response.Status.BAD_REQUEST)
								.type(MediaType.TEXT_PLAIN_TYPE)
								.entity("Account not updated")
								.build());
						return null;
					}

					var identity = userProfilePostResponse.getData();
					return new ResponseBodyDto<>("Profile has been updated successfully.", identity);
				})
				.thenAccept(response::resume)
				.exceptionally(throwable -> {
					response.resume(Response
							.serverError()
							.type(MediaType.TEXT_PLAIN_TYPE)
							.entity(throwable.getMessage())
							.build());
					return null;
				});
	}
}
