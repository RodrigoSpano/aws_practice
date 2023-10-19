const { Cognito } = require('../utils/provider')

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body)

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: process.env.USER_POOL_CLIENT,
  }
  try {
    const response = await Cognito.initiateAuth(params).promise()

    if (response.AuthenticationResult.AccessToken) {
      const userData = await Cognito.getUser({ AccessToken: response.AuthenticationResult.AccessToken }).promise()
      return {
        statusCode: 202,
        body: JSON.stringify({
          AccessToken: response.AuthenticationResult.AccessToken,
          userData
        })
      }
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error)
    }
  }
}