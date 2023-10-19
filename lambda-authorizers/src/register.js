const { Cognito } = require('../utils/provider')

const handler = async (event) => {
  const { username, email, password } = JSON.parse(event.body)

  const params = {
    ClientId: process.env.USER_POOL_CLIENT,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      }
    ]
  }

  const confirmParams = {
    UserPoolId: process.env.USER_POOL,
    Username: username
  }

  try {
    await Cognito.signUp(params).promise()
    await Cognito.adminConfirmSignUp(confirmParams).promise()
    return {
      statusCode: 200,
      body: JSON.stringify('user registered')
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }

  }

}

module.exports = { handler }