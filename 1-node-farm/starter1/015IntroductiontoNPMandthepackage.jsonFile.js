// In this lecture Jonas explained how to install files from NPM and also how to go thru npm.js to do that.
// I already know most of this bcos he taught this in his javascript course pt17. So if i wan to understand
// it i might as well go thru that course

// ////////////
const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

//Importing our own module : we could call it anything we want
const replaceTemplate = require("./modules/replaceTemplate");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true)); // we pass "true" here inorder to actually parse the query into an object. query means
  // this "?id=0" of a URL.
  // Getting the query and pathname
  const { query, pathname } = url.parse(req.url, true);

  //Overview Page
  // Replacing the pathname by that from the VSC terminal
  if (pathname === "/" || pathname === "/overview") {
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { "content-type": "text/html" });

    //Looping over the dataObj which is our /dev-data/data.json file to display to display the various cards as seen in our html in
    // "/templates/template-card.html"
    const cardsHtml = dataObj
      // This fc will replace an array, with the five final HTML's each for one of the five cards i.e product in that dev-data/data.json
      .map((el) => replaceTemplate(tempCard, el))
      .join(""); //join('') converts to allthe templtes to string
    // console.log(cardsHtml);

    ///Replacing the placeholder with the HTML we just created i.e cardsHTML
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output); // This is sending a response to the client

    // Product Page
  } else if (pathname === "/product") {
    // console.log(query); // to know which query i.e product we are dealing with.
    res.writeHead(200, { "content-type": "text/html" });
    /// This part gives us the product we want to display. This part gives us the array number of the product(which isthe product itself)
    // we want to access
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // API
    // we created this route bcos of our API i.e for this project we are working on in this section.
  } else if (pathname === "/api") {
    //we need to tell the browser that we're sending back JSON by doing the below:
    res.writeHead(200, { "content-type": "application/json" });
    res.end(data); // This is sending back the data as a response. The data is a string not an object
  } else {
    //Not Found
    res.writeHead(404, {
      //1)these are standard headers
      "Content-type": "text/html",

      //2)specifying our own header
      "my-own-header": "hello-world",
    }); //This writeHead() can also send headers. To do this we need to specify an object as seen and put the headers
    // we want to send
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000"); // Just displaying a message that the server as started
}); //1st parameter is port, 2nd is the host i.e local host. As an optional parameter, we can pass in a
// a callback fc, which will be run as soon as the server starts listening for request.

/// The project of this lecture is finally finished.
