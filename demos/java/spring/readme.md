# Java Spring

This is the sample demo of LoginRadius IAM implementation using Spring framework.

## How to use

While using this theme folder, you need to have a LoginRadius account to experience the smooth login functionality.

## Prerequisites

### Environment

You should have Java 8+ SDK and Maven installed on your computer in order to use this demo

### Getting Credentials

After signing up for LoginRadius, you can get all the required credentials to communicate with LoginRadius APIs. Go through this document to get your API credentials from LoginRadius Dashboard.

API credentials are as below

APP Name
API Key
API Secret

## Configure Demo  

Add your API Key,to do so go in [LoginRadiusServices](src/main/java/com/loginradius/springdemo/LoginRadiusServices.java) file and change *API-KEY* by your personal api key and *API-SECRET* by your personal api secret.  

You'll also need to tell Spring where are the FrontEnd files as we don't use the default path.  
To do so go into the [properties](src/main/resources/application.properties) file and change the path to your absolute path.  
**Example:** */home/my-user/developer-authentication-demos/theme* OR *C:/Users/my-user/developer-authentication-demos/theme*

### File Explained

`application.properties`: This file allow us to add particular settings to our application, in this case we need to tell him the path to our Theme/FrontEnd folder because we're not using the Spring default path

`LoginRadiusServices.java`: This file contains the interaction we make with the LoginRadius SDK in which we've setup methods to get Profile informations and modify profile informations.  

`Controller.java`: This file contains the code that create our RestAPI, we created a GET and a POST for `/api/profile` and use the methods from LoginRadiusServices to get and update data.  

`SpringDemoApplication.java`: This file is the main file and start the server.  

## Running the Demo

Open a terminal and go where the [mvnw](./mvnw) file is located and in a command line, type:

```bash
./mvnw spring-boot:run
```

Once loaded, you can go in your browser and open [localhost:8080](http://localhost:8080) and see your login page.  
