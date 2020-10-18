package com.loginradius.springdemo;

import com.loginradius.sdk.api.authentication.AuthenticationApi;
import com.loginradius.sdk.models.requestmodels.UserProfileUpdateModel;
import com.loginradius.sdk.models.responsemodels.otherobjects.UserProfilePostResponse;
import com.loginradius.sdk.models.responsemodels.userprofile.Identity;
import com.loginradius.sdk.util.AsyncHandler;
import com.loginradius.sdk.util.ErrorResponse;
import com.loginradius.sdk.util.LoginRadiusSDK;
import com.loginradius.springdemo.objects.Response;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

@Service
public class LoginRadiusServices {

    @PostConstruct
    public void initLoginRadius(){
        LoginRadiusSDK.Initialize.setApiKey("<YOUR-API-KEY>");
        LoginRadiusSDK.Initialize.setApiSecret("<YOUR-API-SECRET>");
    }


    public Response getUserProfile(HttpServletRequest req){
        String accessToken = req.getParameter("token");
        AuthenticationApi authApi = new AuthenticationApi();

        final Response[] response = new Response[1];

        authApi.getProfileByAccessToken(accessToken, null, new AsyncHandler<>() {
            @Override
            public void onSuccess(Identity identity) {
                response[0] = new Response("success","Profile Fetched", identity);
            }

            @Override
            public void onFailure(ErrorResponse errorResponse) {
                System.out.println(errorResponse.getDescription());
                response[0] = new Response("error",errorResponse.getMessage(), errorResponse.getDescription());
            }
        });
        return response[0];
    }

    public Response updateUserProfile(HttpServletRequest req,String data) {
        AuthenticationApi authApi = new AuthenticationApi();
        JSONObject info = new JSONObject(data);
        final Response[] response = new Response[1];

        final String accessToken = info.getString("token");

        final UserProfileUpdateModel updatedProfileInfo = new UserProfileUpdateModel();
        updatedProfileInfo.setFirstName(info.getString("firstname"));
        updatedProfileInfo.setLastName(info.getString("lastname"));
        updatedProfileInfo.setAbout(info.getString("about"));

        final String emailTemplate = "", fields = "", smsTemplate = "", verificationUrl = "http://localhost:8080/demo";

        authApi.updateProfileByAccessToken(accessToken, updatedProfileInfo, emailTemplate, fields, smsTemplate, verificationUrl, new AsyncHandler<>() {
            @Override
            public void onSuccess(UserProfilePostResponse<Identity> identityUserProfilePostResponse) {
                System.out.println("Profile Updated");
                if(identityUserProfilePostResponse.getIsPosted()){
                    response[0] = new Response("success","Profile Updated",identityUserProfilePostResponse.getData());
                }else{
                    response[0] = new Response("error","Profile Not Updated",identityUserProfilePostResponse.getData());
                }
            }

            @Override
            public void onFailure(ErrorResponse errorResponse) {
                System.out.println(errorResponse.getDescription());
                response[0] = new Response("error",errorResponse.getMessage(), errorResponse.getDescription());
            }
        });

        return response[0];
    }

}
