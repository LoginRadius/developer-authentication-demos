LoginRadius Developer Golang Echo Framework Demo 
=======================================

## How to use



While using this theme folder, you need to have a LoginRadius account to experience the smooth login functionality.

### Folder structure

```

theme/
  --|config.env
  --|readme.md
  --|main.go
  --|go.mod
  --|go.sum

```

### Getting Credentials

After signing up for LoginRadius, you can get all the required credentials to communicate with LoginRadius APIs. Go through this document to get your API credentials from LoginRadius Dashboard.

API credentials are as below
- APP Name
- API Key
- API Secret



### Configure demo

Add a file name at `config.env`, and replace your API key and App name and APP secret with the one obtained from the above step. A sample `config.js.example` file has been added for your reference.

```
APIKEY= <..APIKEY..>
APISECRET= <..APISECRET..>

```

### File explained

`config.env` : This is used to set the configuration for the corresponding app registered on LoginRadius for using the authentication mechanism.

`main.go` : This file is setting up the server to run the demo. Here the view path has been setup as a commonly defined theme folder. To fetch and update profile, we have created two APIs, namely `/api/profile` with `GET` and `POST` methods respectively. Under the hood, these APIs are using the Node JS SDK to interact with LoginRadius ecosystem. 

### Running the demo

Once the configuration has been setup for the backend code, you can install the related packages using the following command

```
go run main.go 
```

or 

```
go build main.go
```
After that you need to run the demo using below command

```
./main.exe
```
After running this, you can see that a complete login page would be displayed on `https://localhost:3000/`
