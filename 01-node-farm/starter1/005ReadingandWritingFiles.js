// In this lecture, we will belearning how to Write and Read data from files

const fs = require('fs'); // fs stands for file sys. With this line of code, we will get access to fcs for reading data and writing data, right
// to the file sys. This "require("fs")" returns a lot of object that we can use.

// Blocking, Synchronous way
//1) Reading a File or Reading from a File
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); // this takes 2 arguments: the 1st is the path to the file that we're reading and then also the character encoded.
//utf-8 is used wheb using only english. When not specified, we get a buffer.
console.log(textIn);

//2) Writing a File or Writing into a File
const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut); // The 1st parameter is the path to the file and the 2nd parameter here, is the file we want to write into.
// Writing into a file willnot return anything meaningful, so we don't store it in any variable.
console.log('File written!');
