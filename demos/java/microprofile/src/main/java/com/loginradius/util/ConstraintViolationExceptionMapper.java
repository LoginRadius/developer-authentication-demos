package com.loginradius.util;

import com.google.common.collect.Iterables;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

/**
 * JAX-RS ExceptionMapper to handle Bean Validation's ConstraintViolationException.
 *
 * Copied from <a href="https://gist.github.com/daniel-shuy/6ea3942ccd944800d1fd2f28683e79d2">https://gist.github.com/daniel-shuy/6ea3942ccd944800d1fd2f28683e79d2</a>
 */
@Provider
public class ConstraintViolationExceptionMapper implements ExceptionMapper<ConstraintViolationException> {
	@Override
	public Response toResponse(ConstraintViolationException exception) {
		Set<ConstraintViolation<?>> constraintViolations = exception.getConstraintViolations();
		List<String> errorMessages = constraintViolations.stream()
				.map(constraintViolation -> {
					String name = Iterables.getLast(constraintViolation.getPropertyPath()).getName();
					return name + " " + constraintViolation.getMessage();
				})
				.collect(Collectors.toList());
		return Response
				.status(Response.Status.BAD_REQUEST)
				.type(MediaType.APPLICATION_JSON_TYPE)
				.entity(errorMessages)
				.build();
	}
}
