//dir=>directory
//cmd=> command

/// In this video we're gonna learn how to require 3rd party modules from NPM registry, since so far in this section, we learnt
// how to require node.js core modules, how to require our own modules.

// We do all the requiring from the top, 1st the core modules, 2nd, the 3rd-party modules, and then  our own coming from our
// local file sys.

// The 3rd party module we are gonna require is the "slugify" that we installed in our package.json file. slugify will be a fc
// just used to create slugs. SLUG: This is the last part of a URL that contains a unique string that identifies the resource
// that the website is displaying. For  e.g in our just completed project, instead of having our this part in our url "product?id=0",
// we have it replaced by "product/fresh-avocado" i.e by the name of the real product. So this part "fresh-avocado" willl be the
// "slug". To figure how "slug" works, u can go to the documentation online by NMP and check it.

// ////////
const fs = require("fs");
const http = require("http");
const path = require("path");
const url = require("url");

// Requiring a 3rd party module after the core modules
const slugify = require("slugify");

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

///////////// This is for this lecture
// Creating an array of slugs for all our product in dataObj
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
/// Now we could go ahead and actually store these slugs here into the "data-json" file and then build the app so that instead of
// the ID, it displays the slug in the URL. But i am not gonna go ahead and do that here bcos that's just using the same concept
// that we learned b4 all over again, and it adds nothing new.
/////////////////

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
