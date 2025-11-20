//dir=>directory
//cmd=> command
// dvprs=> developers
// sm => some
// smth=> smth

// In this lecture, we will talk about more stuff u should know when working with NPN packages such as versioning, updating, or
// deleting packages, and also so sm other stuffs.

//1) In versioning like this "nodemon": "^3.1.10", the 1st digit is called
//c) And 3rd the patch version: Now this versionis intended to fix bugs. For e.g let's say that in version 3.1, the dvprs found
// a bug and so they fixed that bug and then released 3.1.1. Then they found another bug and then released 3.1.2 and so on and
// so forth until they reached 3.1.10.

//b) 2nd minor version: These introduces sm new features into the package, but it does not include breaking changes. So all the
// changes that are done in a new version number will always be backward-compatible. So if one day, the "nodemon" team, for e.g
// decides to release version 3.2, well that will then include sm new features but it will not break our code.

//a) the major version: This is only bumped up whenever it is a huge new release which can have breaking changes. For e.g, if
// "slugify" 4 comes along, well our code might no longer work bcos the slugify fc that we have below i.e slugify(el.productName, {lower:true}),
// might have changed its name or maybe the parameter that it expects are difft or the opions might have changed, or smth might
// have changed that will break previous version. And so be aware that when there is a new version, it might usually affect the
// code that u already have. Bcos of this, it is important to talk about updating packages.

//2) Updating Packages: In this "^3.1.10", "^" specifies which updates we accept for each of the packages. This "^" symbol, which
// npm specifies here by default means that we accept patch and minor releases.

//3) Now how do we actually update packages?
//The 1st thing we can do is to check if there are outdated packages by doing "npm outdated" in the terminal. This will give us
// a table of all the outdated packages.
// We can also install a certain package with a certain version number.we do "npm i slugify 1.0.0". Then we can run "npm outdated"
// to see he outdated
//Then we can update it by doing "npm update slugify".
// We can use the "*" symbol like this "*3.1.10". That symbol includes all the versions With this we can update the package to the
// latest version that is available
// The safest version to use is "~3.1.10". This "~" is used for only bug fixes whcih is very good.

//4) Deleting a package
// Let's install express by doing "npm i express", so we can then go and delete it.
// So we can delete by doing "npm uninstall express". So any time we descide not touse any module again, we can always go ahead to
// uninstall it.

//5) I want to talk about the node_modules folder: He just talked about how to install node_modules without copying it manually but
// doing "npm i" and also we should never send our node_modules folder to the Github repo.

//6) package.json file: Checking this file, we will see all the versions of our dependencies. Not only that we will also see the
// versions the dependencies of our dependencies. What i mean is that we will see all the packages our dependencies depend on also.
// ////////
const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

// Requiring a 3rd party module after the core modules
const slugify = require('slugify');

//Importing our own module : we could call it anything we want
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

////////////
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

///
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
