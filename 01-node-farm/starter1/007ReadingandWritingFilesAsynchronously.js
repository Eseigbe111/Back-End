//In this lecture Implementing Synchronous and Asynchronous codes.
// Here we will Read and Write Files just like b4 but in an asynchronous way

const fs = require('fs'); // fs stands for file sys. With this line of code, we will get access to fcs for reading data and writing data, right
// to the file sys. This "require("fs")" returns a lot of object that we can use.

/// Non-blocking,Asynchronous way
//1) Reading a File or Reading from a File
////a) Reading one file
//  Our 1st parameter is the path to the file, the 2nd is utf-8 code, and 3rd parameter is a callback fc. The callback fc takes 2 parameters:
// The 1st being an err and the 2nd is the data
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  // console.log(data);
});
// To show its asynchronous nature, console.log("Will read this"), so u can see that the execution of the code is not stopped by the reading of the file
// console.log("Will read this!"); // This will be logged first bcs of the non-blocking or asynchronous nature of the file being read by Node.js.

//b) Let's see how we can Read 2 files: In this e.g, the result of the 2nd is dependent on the 1st
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    // console.log(data2);
  });
});
// console.log("Will read file!");

//c) Let's see how we can Read 3 files: Ths way of Readig and Writing a file below is wht we call "callback hell"
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log(data2);
    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
      console.log(data3);

      //// 2) Writing a file asynchronously: This also accepts 4 parameters: the path, content of the new file, 'utf-8' and also a callbach fc,but in this
      // case there is no data that we read, so we don't need the 2 argument
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
        console.log('Your file has been written 😊');
      });
    });
  });
});
console.log('Will read file!');

// /// The below is a way of handling error if one occurred
// fs.readFile('./txt/starttt.txt', 'utf-8', (err, data1) => {
//   //Simulating that the file name was not found
//   if (err) return console.log('ERROR! 💥'); // This if an error was encountered
//   console.log(data1);
// });
