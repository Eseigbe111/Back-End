// Parsing Variables From URLS:
// So we will are gonna learn how to parse sm variables from the URL in order to be able to build the product page
// and for this we will need the module url

const fs = require('fs');
const http = require('http');
const url = require('url');

//CREATING a fc that replaces the various HTML holders with the actual HTML values
const replaceTemplate = (temp, product) => {
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

/// Reading our files
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

//
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// console.log(data);
const dataObj = JSON.parse(data); // we consert to json bcos that;s what JS understands
// console.log(dataObj);

// CREATING SERVER
// The 1st step to Routing is to be able to actually to analyze the URL. And for that we will use another built in module called URL
const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  // const pathName = req.url;
  if (pathname === '/' || pathname === '/overview') {
    // REPLACING THE PLACEHOLDERS WITH ACTUAL TEMPLATES
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { 'content-type': 'text/html' });

    // creating the HTML
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join(''); // el is the curr product
    // console.log(cardsHtml);

    // Replacing the "PRODUCT_CARDS" with the actual HTML
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output); //This called sending a response to the client in
    // web browser
  } else if (pathname === '/product') {
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { 'content-type': 'text/html' });

    // Getting obj from the url
    // product?id=0 i.e query=product?  id=0
    const prodObj = dataObj[query.id];

    const output = replaceTemplate(tempProduct, prodObj);

    res.end(output);
  }
  // and rendering it on the page
  else if (pathname === '/api') {
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
