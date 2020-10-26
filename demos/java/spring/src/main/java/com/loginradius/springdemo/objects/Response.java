package com.loginradius.springdemo.objects;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class Response {
    private final String status;
    private final String message;
    private String data;

    public Response(String status, String message){
        this.status = status;
        this.message = message;
    }

    public Response(String status, String message, String data){
        this(status,message);
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public void setData(String data){
        this.data = data;
    }
    public Object getData(){
        return new Gson().fromJson(this.data, Object.class);
    }
}
