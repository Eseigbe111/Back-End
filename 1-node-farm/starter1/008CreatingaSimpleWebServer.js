// In this lecture we will create a simple web server capable of accepting requests and sending back responses. And to do this, we will have
// to include yet another package or module called http.

const fs = require('fs'); // fs stands for file sys. With this line of code, we will get access to fcs for reading data and writing data, right
// to the file sys. This "require("fs")" returns a lot of object that we can use.

//including the http module: Ths gives us the networking capability such as building an http server.
const http = require('http');

/// Now in order to build a server, we must do 2 things: Create a server, and start the server so we can actually listen to incoming request
//1) CREATING SERVER
// this accepts a callback fc, that will be fired up each time a new request hits our server. This also gets access to 2 important
// variables. They are the request, and response variables
// The res object gives us a lot of tools basically for dealing with the response
const server = http.createServer((req, res) => {
  // console.log(req); // Examining the request object. we will see the ppts of the request object
  res.end('Hello from the server!'); // This is sending a response to the client
});

//2) LISTENING TO INCOMING REQUESTS FROM CLIENT: In order to do this we need to save the result of this "createServer()" to a new variable.
// listen() accepts a couple of parameters: the 1st is the port, which could be 8000, or u could see other numbers like 3000, or 80 etc, and 2nd
// is the host. We actually don't need to specify it and then we'll default to local host, but we can actually specify it to
// local host explicitly also  if we want to.
// Port: This is a sub-address on a certain host
// Local Host : Is simply the computer that the program is currently running in.
// All we have to do now is to go to the url(127.0.0.1) on our computer on port 8000. B4 we do that we need to run the " node 008CreatingaSimpleWebServer"
// in the terminal. U will see that the app will keep on running i.e " node 008CreatingaSimpleWebServer" will keep on running, and this is bcos of smth
// called event loop.
// So we will paste 127.0.0.1:8000 on our browser
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000'); // Just displaying a message that the server as started
}); //1st parameter is port, 2nd is the host i.e local host. As an optional parameter, we can pass in a
// a callback fc, which will be run as soon as the server starts listening for request.
