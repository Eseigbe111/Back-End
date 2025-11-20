const fs = require('fs');

// To create a webserver, we will need a moduls called http:
// And gives us the networking capability such as building an http server.
const http = require('http');

// We do these two things in order to create a server
//1) CREATING SERVER
const server = http.createServer((req, res) => {
  console.log(req);
  res.end('Hello from the server!');
});

//2) LISTENING TO INCOMING REQUESTS FROM CLIENT:
server.listen(8000, '127.0.0.1', () => {
  // server.listen() — This method tells your server to start listening for incoming requests.
  // 8000 — This is the port number.
  // '127.0.0.1' — This is the IP address for your local host (your own computer).It means the
  // server will only be accessible from your own machine, not the internet.
  console.log('Listening to requests on port 8000');
});
