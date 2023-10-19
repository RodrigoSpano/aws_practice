const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')

const cognitoIssuer = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL}`;

const client = jwksClient({
  jwksUri: `${cognitoIssuer}/.well-known/jwks.json`,
});

async function verifyToken(token, kid) {
  const key = await client.getSigningKey(kid);
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      key.getPublicKey(),
      { issuer: cognitoIssuer },
      (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      }
    );
  });
}

const handler = async (event) => {
  const authHeader = event.authorizationToken

  if (!authHeader) {
    return {
      statusCode: 401,
      body: JSON.stringify('missing auth token')
    }
  }

  if (!authHeader.startsWith('Bearer')) {
    return {
      statusCode: 400,
      body: JSON.stringify('invalid auth token format')
    }
  }

  const token = authHeader.substring(7)
  const decodedToken = jwt.decode(token, { complete: true })
  const userData = await verifyToken(token, decodedToken.header.kid)
  event.user = userData
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: 'execute-api:Invoke',
          Resource: event.methodArn,
        },
      ],
    },
  };
}

module.exports = { handler }