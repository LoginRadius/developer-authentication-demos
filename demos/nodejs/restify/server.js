const restify = require('restify');

const config = require('./config');
const lrObj = require('loginradius-sdk')(config);

const path = require('path');

const VIEW_PATH = path.join(__dirname, '../../../theme');

// Creates a server boject
const server = restify.createServer({
  name: 'restifyDemo',
  version: '1.0.0'
});

// Parses the Accept header, and ensures that the server can respond to what the client asked for
server.use(restify.plugins.acceptParser(server.acceptable));
// Parses the HTTP query string
server.use(restify.plugins.queryParser());
// Parses the HTTP request body
server.use(restify.plugins.bodyParser());

// Route for Login/Register page
server.get('/*', restify.plugins.serveStatic({
    directory: VIEW_PATH,
    default: 'index.html'
}));
// Route to GET the profile info with a token
server.get('/api/profile', (req, res, next) => {
    let output = {};
    output.status = 'error';
    output.message = 'an error occoured';
    let token = req.query.token ? req.query.token : '';
    if (token === '') {
      output.message = 'Token is required';
    } else {
      let fields = '';
      lrObj.authenticationApi.getProfileByAccessToken(token, fields).then((response) => {
        if ((response.Uid && response.Uid != '')) {
          output.data = response;
          output.message = 'Profile fetched';
          output.status = 'success';
        } else {
          output.message = 'Account does not exist.';
        }
        res.send(output);
        return next();
      }).catch(function (error) {
        output.message = error.Description;
        res.send(output);
        return next();
      });
    }
  return next();
});
// Route to UPDATE the profile info with a token
server.post('/api/profile', (req, res, next) => {
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

        lrObj.authenticationApi.updateProfileByAccessToken(accessToken, userProfileUpdateModel, emailTemplate, fields, nullSupport, smsTemplate, verificationUrl).then((response) => {
        if (response.IsPosted) {
            output.message = 'Profile has been updated successfully.';
            output.status = 'success';
            output.data = response.Data;
        } else {
            output.message = 'Account not updated';
        }
        res.send(output);
        return next();
        }).catch(function (error) {
        output.message = error.Description;
        res.send(output);
        return next();
        });
    }
    return next();
});

// Starts the server a localhost:3000
server.listen(3000, () => {
  console.log(`Open the ${server.url} for nice authentication demo`);
});