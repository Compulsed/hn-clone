require('source-map-support').install();

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

module.exports.handler = (event: any, context: any, callback: any) => {
  console.log(JSON.stringify(event));

  const error = new Error('My Custom Error');

  console.error(error.stack);

  callback(
        null,
      {
        statusCode: 200,
        body: basePage,
        headers: {'Content-Type': 'text/html'}
      }
  );
};
