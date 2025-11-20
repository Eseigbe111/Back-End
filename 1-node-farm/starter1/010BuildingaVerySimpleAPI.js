//smo=>someone

// In this lecture, we will move on in our project and build an extremely simple web API.
// API: The short answer in this context of web APIs is basically a service from which we can request sm data.In our case, the data that the user wants to request is the
// data about the products that we are offering in this node farm i.e the project we will be building.

// For our project, we have a dev-data folder, in there I have a .json file. The data in the .json file is what our API will send to the client when requested.

const fs = require('fs'); //including the http module: Ths gives us the networking capability such as building an http server.
const http = require('http');

//1) The 1st approach
// const server = http.createServer((req, res) => {
//   console.log(req.url); //Doing this we will get the url in our terminal "/" and "/favicon.ico", which means we have 2 responses:
//   // one log has the slash "/" and the other log has the "/favicon.ico"(this is from the browser)
//   const pathName = req.url;
//   //Routing: The below means if the pathName is either the root or overview
//   if (pathName === "/" || pathName === "/overview") {
//     res.end("This is the OVERVIEW"); // This is sending a response to the client
//   } else if (pathName === "/product") {
//     res.end("This is the PRODUCT");
//     //This is for this section
//     // we created this route bcos of our API i.e for this project we are working on in this section.
//   } else if (pathName === "/api") {
//     // So what we want to do now is to actually read the data from the data.json(), then parse JSON into JavaScript, and then send
//     // back that result to the client.
//     //1) The 1st approach
//     // This is the best way to specify the directory. dirname = directory name. The exception to this is when we want to access
//     // our own modules using the require().
//     fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
//       const productData = JSON.parse(data); // This changes the .json into a javascript object or code
//       //console.log(productData);
//       //we need to tell the browser that we're sending back JSON by doing the below:
//       res.writeHead(
//         200,
//         // 200 means ok
//         {
//           "content-type": "application/json",
//         }
//       );

//       res.end(data); // This is sending back the data as a response. The data is a string not an object
//     });
//     //The above way of reading file is not yet perfect, bcos it is not really 100% efficient, and that is bcos each time that sm now
//     //hits this "/api" route, the files will have to be read and the sent back. Instead, what we can do is to just read the files once
//     // in the beginning, and then each time smo hits this route, simply send back the data without having to read it each time that a
//     // user requested. I will transform the code to the one below that is efficient
//   } else {
//     //Most of the times when u try to open a page that is not found, u see a 404 error. And that is actually smth called an HTTP status
//     //code. and so since we are sending back a response, we can also add the status code to the response as seen below:
//     // res.writeHead(404); // U will see this code when inspecting the browsers terminal

//     res.writeHead(404, {
//       //1)these are standard headers
//       "Content-type": "text/html",

//       //2)specifying our own header
//       "my-own-header": "hello-world",
//     }); //This writeHead() can also send headers. To do this we need to specify an object as seen and put the headers
//     // we want to send
//     res.end("<h1>Page not found!</h1>");
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listening to requests on port 8000"); // Just displaying a message that the server as started
// }); //1st parameter is port, 2nd is the host i.e local host. As an optional parameter, we can pass in a
// // a callback fc, which will be run as soon as the server starts listening for request.

///////////////////////////////////////////////////
// This is the best approach to use

//2) The 2nd approach: we will use the sync() which will allow us put the data in a variable and use instantly
// This is the best way to specify the directory: __dirname = directory name. The exception to this is when we want to access
// our own modules using the require().
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// console.log(dataObj);
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
      'content-type': 'text/html',

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
