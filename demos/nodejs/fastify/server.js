const fastify = require('fastify')({ logger: true });

const bodyParser = require('body-parser');

const config = require('./config');
const lrObj = require('loginradius-sdk')(config);


const path = require('path');

const VIEW_PATH = path.join(__dirname, '../../../theme');

fastify.register(require('fastify-static'), {
  root: VIEW_PATH
});

fastify.get('/', function (request, reply) {
  reply.sendFile('index.html')
});

fastify.get('/api/profile', function (request, reply) {
  let output = {};
  output.status = 'error';
  output.message = 'an error occurred';
  let token = request.query.token ? request.query.token : '';
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
      reply.send(output);
    }).catch(function (error) {
      output.message = error.Description;
    });
  }
  reply.send(output);
});


fastify.post('/api/profile', function (request, reply) {
  let output = {};
  output.status = 'error';
  output.message = 'an error occurred';
  let accessToken = request.body.token ? request.body.token : '';
  let firstname = request.body.firstname ? request.body.firstname : '';
  let lastname = request.body.lastname ? request.body.lastname : '';
  let about = request.body.about ? request.body.about : '';
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
    }).catch(function (error) {
      output.message = error.Description;
    });
  }
  reply.send(output);
});

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Open the ${address} for nice authentication demo`)
})