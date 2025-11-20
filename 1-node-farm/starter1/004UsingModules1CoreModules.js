// we are writing our first node code
/// Remember how i said right in the 1st lecture that with Node.js, we can do all kinds of amazing things that we can not do with Javascript
// in the browser e.g reading files from the file sys. In order to do that, we need to use Node module. Node.js is really built around this
// concept of modules where all kinds of additional fclty are stored in a module. And in the case of reading files, that is inside the FS module.
// We use these modules by using the "require()" into our code and store the result if the "require()" into a variable as seen below.

const fs = require('fs'); // fs stands for file sys. With this line of code, we will get access to fcs for reading data and writing data, right
// to the file sys. This "require("fs")" returns a lot of object that we can use.

const hello = 'Hello world';
console.log(hello);
