
LoginRadius Developer Demo Theme
=================================

This is the basic theme folder containing all HTML, CSS and JavaScript files to create a full-fledged authentication demo. This common theme folder can be utilized in any of the server-side frameworks and further can be extended as per the customized requirements.

## How to use

While using this theme folder, you need to have a LoginRadius account to experience the smooth login functionality.

### Folder structure

```

theme/
  --|assets/
    |--|images/
    |----|lr-logo.png
    |--|scripts/
    |----|apiService.js
    |----|index.js
    |----|options.js
    |----|profile.js
    |----|theme.js
    |----|toast.js
    |----|utility.js
    |--|styles/
    |----loader.css
    |----theme.css
    |----toast.css
  --|index.html
  --|profile.html
  --|readme.md

```

### Getting Credentials

After signing up for LoginRadius, you can get all the required credentials to communicate with LoginRadius APIs. Go through this document to get your API credentials from LoginRadius Dashboard

API credentials are as below

APP Name
API Key
API Secret



### Configure demo

Add a file name at `assets/scripts/options.js`, and replace your API key and App name with the one obtained from the above step. A sample `options.js.sample` file has been added for your reference.

```
var commonOptions = {};


commonOptions.apiKey = "<YOUR API KEY>";
commonOptions.appName = "<YOUR APP NAME>";
const url = window.location.href;
const domainName = url.substring(0, url.lastIndexOf("/"));
const params = url.split("?")[1];

```


After configuration at client side, go to any of server side framework code and set your default view path as `theme/index.html`. 

One your server is setup and running you can see the login page on `localhost:3000/demo`.

