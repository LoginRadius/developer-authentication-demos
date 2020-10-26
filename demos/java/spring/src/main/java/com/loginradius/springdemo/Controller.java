package com.loginradius.springdemo;

import com.loginradius.springdemo.objects.Response;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
public class Controller {
    private static final LoginRadiusServices logRadius = new LoginRadiusServices();

    @GetMapping("/api/profile")
    public Object response(HttpServletRequest req){
        return logRadius.getUserProfile(req);
    }

    @PostMapping("/api/profile")
    public Response updateProfile(HttpServletRequest req,@RequestBody String data) {
        return logRadius.updateUserProfile(req,data);
    }
}
