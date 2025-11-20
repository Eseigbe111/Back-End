// In this lecture, we will continue by replacing the placeholders with the content

////////////
const fs = require('fs');
const http = require('http');

//CREATING a fc that replaces the various HTML holders with the actual HTML values
const replaceTemplate = (temp, product) => {
  // This product.productName is acutally from dev-data/data.json.
  // One trick for this part "{%PRODUCTNAME%}" is not to use the quotation mark but rather use a regular expression bcos there can
  // be mulltiple instances of the placehoder, and so the trick is to wrap this in a regular expression and use the "g flag"(i.e global)
  // on it, so that all of these placeholders we have in our html will get replaced and not just the first one that occurs(i.e {%PRODUCTNAME%}).
  // Temple writting: replaceAll() works currently (2025)
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

  return output;
};
//HTML Template Filling
///Starting with the overview page, The first step here is to load the template overview. Each time there is a new request for this
// route(i.e Overview), the first thing that we're gonna do is to read the template overview. And just like b4 with const data = fs.readFileSync()
// below, we will do it outside the callback bcos these templates will always be the same. So we can actually read them to memory
// right in the beginning when we start the application. And when necessary, we simply go a head and replace the contents in there.
// So we will go a head and do it for all the other 3 templates as seen below.

// NB: Again keep in mind that we can do with the synchronized version bcos, we are in the top level code, which is only executed once,
// right at the beginning whe we load up these applications. So we could not do the below inside of the "http.createServer((req, res))"
// callback fc, bcos "http.createServer((req, res))" is called each time there is a request. And if we had 1 million requests at the
// same time, then we could block the code 1 million times, once for each request. And that is smth that we do not want.

// These reads the files
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
// console.log(tempOverview);
// console.log(tempCard);

////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(req.url); //Doing this we will get the url in our terminal "/" and "/favicon.ico", which means we have 2 responses:
  // one log has the slash "/" and the other log has the "/favicon.ico"(this is from the browser)
  const pathName = req.url;

  //Overview Page
  if (pathName === '/' || pathName === '/overview') {
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { 'content-type': 'text/html' });

    //Looping over the dataObj which is our /dev-data/data.json file to display to display the various cards as seen in our html in
    // "/templates/template-card.html"
    const cardsHtml = dataObj
      // This fc will replace an array, with the five final HTML's each for one of the five cards i.e product in that dev-data/data.json
      .map((el) => replaceTemplate(tempCard, el))
      .join(''); //join('') converts to allthe templtes to string
    console.log(cardsHtml);

    ///Replacing the placeholder with the HTML we just created i.e cardsHTML
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // This line of code is for the below in the template-overview.html as seen below:
    /* 
    <div class="container">
      <h1>🌽 Node Farm 🥦</h1>
      <div class="cards-container">{%PRODUCT_CARDS%}</div>
    </div>
    
    */

    res.end(output); // This is sending a response to the client
    // As u do each part of the above, run the node in ur terminl is VSC and go to the browser to see how it changes the page, b4 we will
    // make it reload automatically.

    // Product Page
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT');

    // API
    // we created this route bcos of our API i.e for this project we are working on in this section.
  } else if (pathName === '/api') {
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data); // This is sending back the data as a response. The data is a string not an object
  } else {
    //Not Found
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
