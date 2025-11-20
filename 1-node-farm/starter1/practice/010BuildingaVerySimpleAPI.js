const fs = require('fs');
const http = require('http');

// BUilding a Very Simple API
// For our project, we have a dev-data folder, in there I have a .json file. The data in the .json file is what our API will send to the client when requested.
// Temple: Since i am revising i went with this approach that is very useful i.e to read files using "directory: __dirname = directory name"

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// console.log(data);
// CREATING SERVER
// The 1st step to Routing is to be able to actually to analyze the URL. And for that we will use another built in module called URL
const server = http.createServer((req, res) => {
  console.log(req.url);

  const pathName = req.url;
  if (pathName === '/' || pathName === '/overview') {
    res.end('This is the OVERVIEW'); //This called sending a response to the client i
    // web browser
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT');
  }
  // THIS IS FOR THIS LECTURE: Reading the data from the file dev-data/data.json
  // and rendering it on the page
  else if (pathName === '/api') {
    res.writeHead(200, {
      // these are standard headers:we want applocation api to be in the form of json inthe browser
      'content-type': 'application/json',
    });

    res.end(data);
  } else {
    // When a page isn't found, we return a 404 HTTP status code.
    // We can add it to the response like this:
    // res.writeHead(404); lie below
    res.writeHead(404, {
      //1)these are standard headers
      'content-type': 'text/html',

      // /2)specifying our own header
      'my-own-header': 'hello-world',
    });

    const myHeaderValue = 'hello-world';

    //Sending a response
    res.end(`
      <h1>Page not found!</h1>
      <p>Custom header: ${myHeaderValue}</p>
      `);
  }
});

// LISTENING TO INCOMING REQUESTS FROM CLIENT:
server.listen(8000, '127.0.0.1', () => {
  // server.listen() — This method tells your server to start listening for incoming requests.
  // 8000 — This is the port number.
  // '127.0.0.1' — This is the IP address for your local host (your own computer).It means the
  // server will only be accessible from your own machine, not the internet.
  console.log('Listening to requests on port 8000');
});
