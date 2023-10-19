const AWS = require('aws-sdk')

const Cognito = new AWS.CognitoIdentityServiceProvider()

module.exports = { Cognito }