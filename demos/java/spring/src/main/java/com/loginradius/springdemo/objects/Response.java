package com.loginradius.springdemo.objects;

public class Response {
    private final String status;
    private final String message;
    private Object data;

    public Response(String status, String message){
        this.status = status;
        this.message = message;
    }

    public Response(String status, String message, Object data){
        this(status,message);
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public void setData(Object data){
        this.data = data;
    }
    public Object getData(){
        return data;
    }
}
