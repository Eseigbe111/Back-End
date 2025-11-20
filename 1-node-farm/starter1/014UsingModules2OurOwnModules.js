// In this lecture, i want to show u that we can actually create our own module and export smth from them like for e.g a fc. Then import
// this fc into another module and then use that fc there.

/// This is for this lecture
// So let's say that we actually had a bunch of dift javascript files in which we used this replaceTemplate(), So what we can do is to create
// a new module and export that fc from it and then import it back here.
// The 1st thing u need to know iis that in Node.js, all file is treated as a module. All these javascript files i have been using are modules
// which in this case imports other modules and particularly the 4 below.

// So let's create a new folder that is called module, and create a file called replaceTemplate.js which will contain the replaceTemplate().
// Now to export the module, there are dift ways of exporting smth from a module and we're gonna talk in depth about all this in another section
// later on. But for now, we will just use "module.exports" in the replaceTemplate.js. In each module we have access to a variable called module
// and on there we can set the export ppt and then wet what we want to export.

// Import always happen at the top of the file after the core modules. To import the fc "replaceTemplate()" from replaceTemplate.js, we will  do
// require('./modules/replaceTemplate')// "." means the current location of this module or any module we want to import

// ////////////
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

//Importing our own module : we could call it anything we want
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true)); // we pass "true" here inorder to actually parse the query into an object. query means
  // this "?id=0" of a URL.
  // Getting the query and pathname
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  // Replacing the pathname by that from the VSC terminal
  if (pathname === '/' || pathname === '/overview') {
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { 'content-type': 'text/html' });

    //Looping over the dataObj which is our /dev-data/data.json file to display to display the various cards as seen in our html in
    // "/templates/template-card.html"
    const cardsHtml = dataObj
      // This fc will replace an array, with the five final HTML's each for one of the five cards i.e product in that dev-data/data.json
      .map((el) => replaceTemplate(tempCard, el))
      .join(''); //join('') converts to allthe templtes to string
    // console.log(cardsHtml);

    ///Replacing the placeholder with the HTML we just created i.e cardsHTML
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output); // This is sending a response to the client

    // Product Page
  } else if (pathname === '/product') {
    // console.log(query); // to know which query i.e product we are dealing with.
    res.writeHead(200, { 'content-type': 'text/html' });
    /// This part gives us the product we want to display. This part gives us the array number of the product(which isthe product itself)
    // we want to access
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
    // we created this route bcos of our API i.e for this project we are working on in this section.
  } else if (pathname === '/api') {
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data); // This is sending back the data as a response. The data is a string not an object
  } else {
    //Not Found
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

/// The project of this lecture is finally finished.
