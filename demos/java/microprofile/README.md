
LoginRadius Developer Java Microprofile Demo 
============================================

This is the sample demo of LoginRadius IAM implementation using the Jakarta EE and Microprofile frameworks.

## How to use

While using this theme folder, you need to have a LoginRadius account to experience the smooth login functionality.

### Getting Credentials

After signing up for LoginRadius, you can get all the required credentials to communicate with LoginRadius APIs. Go through this document to get your API credentials from LoginRadius Dashboard.

API credentials are as below

APP Name
API Key
API Secret

### Configure demo

Add a file named at `microprofile-config.properties`, and replace your API key and secret with the one obtained from the
above step. A sample `microprofile-config.properties.sample` file has been added for your reference.

```
# loginradius.domain=<API_DOMAIN> # uncomment to override default
loginradius.key=<API KEY>
loginradius.secret=<API_SECRET>
```

### Running the demo

1. Install Maven

2. Run
```
mvn clean package tomee-embedded:run
```
This packages the application as a WAR file, and spins up an embedded Apache TomEE instance to run the application.
After running this, you can see that a complete login page would be displayed on `https://localhost:8080/demo/`
