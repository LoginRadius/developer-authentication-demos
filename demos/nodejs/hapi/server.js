const Hapi = require('@hapi/hapi');

const config = require('./config');
const lrObj = require('loginradius-sdk')(config);

const path = require('path');

const VIEW_PATH = path.join(__dirname, '../../../theme');

// Initialization function
const init = async () => {
    // Creates a server on localhost:3000
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: VIEW_PATH
            }
        }
    });

    // Use static file serving
    await server.register(require('@hapi/inert'));
    
    // Route for Login/Register page
    server.route({
        method: 'GET',
        path: '/{file*}',
        handler: {
            directory: {
                path: './',
                index: ['index.html']
            }
        }
    });
    
    // Route to GET the profile info by token
    server.route({
        method: 'GET',
        path: '/api/profile',
        handler: async (request, h) => {
            let output = {};

            output.status = 'error';
            output.message = 'an error occoured';

            let token = request.query.token ? request.query.token : '';

            if (token === '') {
                output.message = 'Token is required';
                return output;
            } 
            else {
                let fields = '';
                const response = await lrObj.authenticationApi.getProfileByAccessToken(token, fields);
                try {
                    if ((response.Uid && response.Uid != '')) {
                        output.data = response;
                        output.message = 'Profile fetched';
                        output.status = 'success';
                        return output;
                    } else {
                        output.message = 'Account does not exist.';
                        return output;
                    }
                } catch (error) {
                    output.message = error.Description;
                    return output;
                }
            }
        }
    });
    
    // Route to Update the profile info using a token
    server.route({
        method: 'POST',
        path: '/api/profile',
        handler: async (request, h) => {
            let output = {};

            output.status = 'error';
            output.message = 'an error occoured';

            let accessToken = request.payload.token ? request.payload.token : '';
            let firstname = request.payload.firstname ? request.payload.firstname : '';
            let lastname = request.payload.lastname ? request.payload.lastname : '';
            let about = request.payload.about ? request.payload.about : '';

            if (accessToken === '') {
                output.message = 'Token is required';
                return output;
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
  
                const response = await lrObj.authenticationApi.updateProfileByAccessToken(accessToken, userProfileUpdateModel, emailTemplate, fields, nullSupport, smsTemplate, verificationUrl);
                try {
                    if (response.IsPosted) {
                        output.message = 'Profile has been updated successfully.';
                        output.status = 'success';
                        output.data = response.Data;
                        return output;
                    } else {
                        output.message = 'Account not updated';
                        return output;
                    }
                } catch (error) {
                    output.message = error.Description;
                    return output;
                }
            }
        }
    });
    
    // Starts the server
    await server.start();
    console.log('Open the localhost:3000 for nice authentication demo');
};

// Handels ERROR : UNHANDELEDREJECTION
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
