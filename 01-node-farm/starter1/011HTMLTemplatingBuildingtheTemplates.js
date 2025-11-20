// So in this lecture, we will be building the template that will hold actually the actual data
// The 1st step is to actually build the templates: One for the overview page and the other for the product detail page.
// We will build thes templates based on the static files in the templates folder

// We will work in the in the product.html(template-product) and overview.html

////////////
const fs = require('fs'); //including the http module: Ths gives us the networking capability such as building an http server.
const http = require('http');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url); //Doing this we will get the url in our terminal "/" and "/favicon.ico", which means we have 2 responses:
  // one log has the slash "/" and the other log has the "/favicon.ico"(this is from the browser)
  const pathName = req.url;
  //Routing: The below means if the pathName is either the root or overview
  if (pathName === '/' || pathName === '/overview') {
    res.end('This is the OVERVIEW'); // This is sending a response to the client
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT');
    //This is for this section
    // we created this route bcos of our API i.e for this project we are working on in this section.
  } else if (pathName === '/api') {
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data); // This is sending back the data as a response. The data is a string not an object
  } else {
    //Most of the times when u try to open a page that is not found, u see a 404 error. And that is actually smth called an HTTP status
    //code. and so since we are sending back a response, we can also add the status code to the response as seen below:
    // res.writeHead(404); // U will see this code when inspecting the browsers terminal

    res.writeHead(404, {
      //1)these are standard headers
      'Content-type': 'text/html',

      //2)specifying our own header
      'my-own-header': 'hello-world',
    }); //This writeHead() can also send headers. To do this we need to specify an object as seen and put the headers
    // we want to send
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000'); // Just displaying a message that the server as started
}); //1st parameter is port, 2nd is the host i.e local host. As an optional parameter, we can pass in a
// a callback fc, which will be run as soon as the server starts listening for request.
