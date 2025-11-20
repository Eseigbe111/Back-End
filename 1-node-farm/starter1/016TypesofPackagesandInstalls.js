//dir=>directory
//cmd=> command

/// In this lecture, we will see the types of packages that can be installed and these are:
//1) Simple dependencies: These are packages that contain sm code that we will include in our own code. So a code upon which we built
// our own application, and that's why we actually call them dependencies bcos or project and our code depend on them to work correctly.
// For e.g, Express, which is the Node framework we are gonna be using later in the corse is a dependency. So let's now install our 1st
//depedency called Slugify, which is a small tool that we can use to make more readable URLs out of names. For e.g, liek product names
// in the case of our node-farm project. So we can do "npm i slugify"

//2) Devpt or dev dependencies: These are usually just tools for devpt. For e.g code bundler like Webpack, or a debugger tool or a testing library.
// They are not needed for production, so our code does not really depend on them. We simply use them to devp our applications. To install
// dev dependency like nodemon, we can do npm i nodemon --save-dev, we do --save-dev to specify it is a dev dependency
// Now nodemon is a very nice tool that helps us devp Node.js applications by automatically restarting the Node applicatio whenevr we chage
// sm files in our working dir. this will help us not to close the server all the time any longer but will automatically restart the server
// each time that we do a change.

// Now let's also talk about the installs of this packages. Now we locally installed the two dependendies. But with npm we can globally install
// dependencies they will be available anywhere, not just in our projct folder but in every folder across ur entire machine.
//Now a package should be installed globally when it provides an executable cmd that u can run from the cmd line interface. And nodemon,for e.g
// one tool like that. I use nodemon in all Node projects that i work on and so i have nodemon installed as a global dependency bcos that way
// i don't have to install it each time that i'm creating  a new project. I can simply use it in a new project bcos it is already installed globally.
// To install globally we can do "npm i nodemon --global". After that, we can use it by "nodemon file.js" file.js means the javascript file i am
// working ith at that instance instead of "node file.js" as we did b4 where we needed to exit it and run it again after each change.

//NB: If we did not install nodemon globally, howdo we use it?
//Now they will not work on the cmd line but what we can do is we can use them thru an npm script in our pakage.json() as seen below:

/* 
"scripts": {
    "start": "nodemon 016TypesofPackagesandInstalls.js"
  }
*/
// Then we can run it by "npm run start" or "npm start"

// ////////
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
