const handler = (event) => {
  console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify(event)
  }
}

module.exports = { handler }