package com.loginradius.util;

import com.holonplatform.json.gson.jaxrs.internal.GsonJsonProvider;
import com.loginradius.sdk.models.responsemodels.userprofile.Identity;

import javax.ws.rs.ext.Provider;

/**
 * Configure JAX-RS to use GSON instead of Jackson for JSON Serialization/Deserialization.
 *
 * <p>This is required to use the LoginRadius Java SDK as the DTOs are annotated with GSON annotations.
 *
 * @see Identity
 */
@Provider
public class GsonMessageBodyProvider extends GsonJsonProvider {
}
