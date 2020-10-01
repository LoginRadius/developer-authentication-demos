const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const config = require('./config');
const lrObj = require('loginradius-sdk')(config);


const path = require('path');

const VIEW_PATH = path.join(__dirname, '../../../theme');
app.use(express.static(VIEW_PATH));

app.set('views', VIEW_PATH);
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: VIEW_PATH
  });
});

app.get('/api/profile', function (req, res) {
  let output = {};
  output.status = 'error';
  output.message = 'an error occoured';
  let token = req.query.token ? req.query.token : '';
  if (token === '') {
    output.message = 'Token is required';
  } else {
    let fields = '';
    lrObj.authenticationApi.getProfileByAccessToken(token, fields).then(function (response) {
      if ((response.Uid && response.Uid != '')) {
        output.data = response;
        output.message = 'Profile fetched';
        output.status = 'success';
      } else {
        output.message = 'Account does not exist.';
      }
      res.send(output);
    }).catch(function (error) {
      output.message = error.Description;
      res.send(output);
    });
  }
});


app.post('/api/profile', function (req, res) {
  let output = {};
  output.status = 'error';
  output.message = 'an error occoured';
  let accessToken = req.body.token ? req.body.token : '';
  let firstname = req.body.firstname ? req.body.firstname : '';
  let lastname = req.body.lastname ? req.body.lastname : '';
  let about = req.body.about ? req.body.about : '';
  if (accessToken === '') {
    output.message = 'Token is required';
  } else {
    let userProfileUpdateModel = {};
    userProfileUpdateModel.FirstName = firstname;
    userProfileUpdateModel.LastName = lastname;
    userProfileUpdateModel.About = about;
    let emailTemplate = '';
    let fields = '';
    let nullSupport = true;
    let verificationUrl = 'http://localhost:3000/demo';
    let smsTemplate = '';

    lrObj.authenticationApi.updateProfileByAccessToken(accessToken, userProfileUpdateModel, emailTemplate, fields, nullSupport, smsTemplate, verificationUrl).then(function (response) {
      if (response.IsPosted) {
        output.message = 'Profile has been updated successfully.';
        output.status = 'success';
        output.data = response.Data;
      } else {
        output.message = 'Account not updated';
      }
      res.send(output);
    }).catch(function (error) {
      output.message = error.Description;
      res.send(output);
    });
  }
});

app.listen(3000, () => console.log('Open the localhost:3000 for nice authentication demo'));