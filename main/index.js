'use strict'

const basePage = `<html>
<h1>Hi!</h1>
  <form method="POST" action="">
    <label for="uri">Link:</label>
    <input type="text" id="link" name="link" size="40" autofocus />
    <br/>
    <br/>
    <input type="submit" value="Shorten it!" />
  </form>
</html>`

module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event))
  callback(
        null,
    {
      statusCode: 200,
      body: basePage,
      headers: {'Content-Type': 'text/html'}
    }
    )
}
