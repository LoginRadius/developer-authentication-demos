package com.loginradius.service;

import com.google.gson.Gson;
import com.loginradius.sdk.api.authentication.AuthenticationApi;
import com.loginradius.sdk.models.requestmodels.UserProfileUpdateModel;
import com.loginradius.sdk.models.responsemodels.otherobjects.UserProfilePostResponse;
import com.loginradius.sdk.models.responsemodels.userprofile.Identity;
import com.loginradius.sdk.util.AsyncHandler;
import com.loginradius.sdk.util.ErrorResponse;
import com.loginradius.sdk.util.LoginRadiusSDK;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import javax.annotation.PostConstruct;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

@ApplicationScoped
public class LoginRadiusService {
	private static final Gson GSON = new Gson();

	@Inject
	@ConfigProperty(name = "loginradius.domain")
	private Optional<String> domain;

	@Inject
	@ConfigProperty(name = "loginradius.key")
	private String key;

	@Inject
	@ConfigProperty(name = "loginradius.secret")
	private String secret;

	private AuthenticationApi authenticationApi;

	@PostConstruct
	private void init() {
		LoginRadiusSDK.Initialize.setApiKey(key);
		LoginRadiusSDK.Initialize.setApiSecret(secret);

		domain.ifPresent(LoginRadiusSDK.Initialize::setCustomDomain);

		authenticationApi = new AuthenticationApi();
	}

	public CompletionStage<Identity> getProfile(String accessToken) {
		var handlerFuture = new AsyncHandlerFutureWrapper<Identity>();
		authenticationApi.getProfileByAccessToken(accessToken, null, handlerFuture);
		return handlerFuture;
	}

	public CompletionStage<UserProfilePostResponse<Identity>> updateProfile(
			String accessToken, UserProfileUpdateModel userProfileUpdateModel) {
		var handlerFuture = new AsyncHandlerFutureWrapper<UserProfilePostResponse<Identity>>();
		authenticationApi.updateProfileByAccessToken(accessToken,
				GSON.toJsonTree(userProfileUpdateModel).getAsJsonObject(),
				null, null, true, null, null,
				handlerFuture);
		return handlerFuture;
	}

	/**
	 * A bridge to convert a LoginRadius {@link AsyncHandler} callback to a {@link CompletableFuture}.
	 */
	private static class AsyncHandlerFutureWrapper<T> extends CompletableFuture<T> implements AsyncHandler<T> {
		@Override
		public void onSuccess(T t) {
			complete(t);
		}

		@Override
		public void onFailure(ErrorResponse errorResponse) {
			completeExceptionally(new Exception(errorResponse.getDescription()));
		}
	}
}
