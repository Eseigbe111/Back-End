//// In this lecture we will implement and talk about a concept call Routing
// Routing: This just means implementing dift actns for dift url i.e if our url changes we want the action to go to the url or give  a respone.
// Now Routing can actually bcom very very complicated in a big, real world applicatn and in that case we will use a tool for that like Express.
// That is what we will use in our next big project.

const fs = require('fs'); // fs stands for file sys. With this line of code, we will get access to fcs for reading data and writing data, right
// to the file sys. This "require("fs")" returns a lot of object that we can use.

//including the http module: Ths gives us the networking capability such as building an http server.
const http = require('http');

//Routing:
// The 1st step to Routing is to be able to actually to analyze the URL. And for that we will use another built in module called URL

const server = http.createServer((req, res) => {
  console.log(req.url); //Doing this we will get the url in our terminal "/" and "/favicon.ico", which means we have 2 responses:
  // one log has the slash "/" and the other log has the "/favicon.ico"(this is from the browser)
  const pathName = req.url;
  //Routing: The below means if the pathName is either the root or overview
  if (pathName === '/' || pathName === '/overview') {
    res.end('This is the OVERVIEW'); // This is sending a response to the client
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT');
  } else {
    //Most of the times when u try to open a page that is not found, u see a 404 error. And that is actually smth called an HTTP status
    //code. and so since we are sending back a response, we can also add the status code to the response as seen below:
    // res.writeHead(404); // U will see this code when inspecting the browsers terminal

    res.writeHead(404, {
      //1)these are standard headers
      'content-type': 'text/html',

      //2)specifying our own header
      'my-own-header': 'hello-world',
    }); //This writeHead() can also send headers. To do this we need to specify an object as seen and put the headers
    // we want to send
    //***HTTP header***: Is basically a piece of information about the response that we are sending back.
    // 1) One way we can specify a standard header is to do:
    /* 
    res.writeHead(404,{
     "Content-type": "text/html",
    })

    then we set the res.end to a <h1> in order to basically send back html:
    res.end('<h1>Page not found!</h1>')

    //2) we can also specify our own headers by doing:
    'my-own-header': "hello-world"

    */
    // res.end("Page not found");
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000'); // Just displaying a message that the server as started
}); //1st parameter is port, 2nd is the host i.e local host. As an optional parameter, we can pass in a
// a callback fc, which will be run as soon as the server starts listening for request.
