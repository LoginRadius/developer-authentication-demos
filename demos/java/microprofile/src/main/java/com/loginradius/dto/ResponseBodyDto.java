package com.loginradius.dto;

public class ResponseBodyDto<T> {
	private final String status = "success";

	private final String message;
	private final T data;

	public ResponseBodyDto(String message, T data) {
		this.message = message;
		this.data = data;
	}

	public String getStatus() {
		return status;
	}

	public String getMessage() {
		return message;
	}

	public T getData() {
		return data;
	}
}
