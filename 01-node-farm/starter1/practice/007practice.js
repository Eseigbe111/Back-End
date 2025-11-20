//READING AND WRITING FILES
const fs = require('fs'); // fs for file sys. module
const http = require('http');

//READING A FILE
// Blocking, Synchronous way
//1) Reading a File or Reading from a File
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);

const textOut =
  'This was what I said about the delay:\n' +
  textIn +
  '\n' +
  'Please find below the requested details:\n' +
  'S/N: WRN202832877.\n' +
  'PIN: 743413836769.\n' +
  'Year: 2024.\n' +
  'Examination Number: 4240951033.\n' +
  'School Type: Omido Community High School.';

fs.writeFileSync('./txt/output1.txt', textOut);
// console.log('File written successfully');

//Non-blocking,Asynchronous way
//a) Reading a File or Reading from a File
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  // console.log(data);
});
// console.log('Will read file');

//b) Let's see how we can Read 2 files:
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  // console.log(data);
  fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1) => {
    // console.log(data1);
  });
});
// console.log('Will read file');

//c) Let's see how we can Read 3 files: Ths way of Readig and Writing a file below is wht we call "callback hell"
fs.readFile('./txt/start.txt', 'utf-8', (err, data) => {
  console.log(data);
  fs.readFile(`./txt/${data}.txt`, 'utf-8', (err, data1) => {
    console.log(data1);
    fs.readFile('./txt/append.txt', 'utf-8', (err, data2) => {
      console.log(data2);

      // Writing a file asynchronously:
      fs.writeFile('./txt/final.txt', `${data1}\n${data2}`, 'utf-8', (err) => {
        console.log('Your file has been written 😊');
      });
    });
  });
});
console.log('Will read file!');

// /// The below is a way of handling error if one occurred
fs.readFile(`./txt/starttt.txt`, 'utf-8', (err, data1) => {
  if (err) return console.log('ERROR! 💥');
});
