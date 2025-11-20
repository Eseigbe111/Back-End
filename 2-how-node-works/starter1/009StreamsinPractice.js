// In this lecture, we will implement working with streams

const fs = require('fs');
const server = require('http').createServer(); // The  result for requiring an http is the http onject and then
//we can call the .createServer() on it.

/// Now let's say that for sm reason inour application, we need to read a large text file from the file sys,
// and then send it to the client. So how do we do that? well there are multiple ways and we're going to explore
// a few of them starting from the most basic one and moving all the way to the best way of doing this.

//1) soln 1: The prob with this soln is that node will have to load the entire file into memory, bcos only that's
// read, it can then send that data. Now this is a prob when the file is big, and also when there are a ton of
// requests hitting ur server. Bcos the node proces will very quickly run out of resources and ur app will quit
// working, everything will crash, and ur users will not be happy. So this will work when  just creating  it
// locally for just ourselves.
// Creating an Event
server.on('request', (req, res) => {
  //    // soln 1:
  // So the 1st soln that we're going to use is the easiest and the most straight-forward one. Which is to simply
  // read the file into a variable, and thenonce that's done, send it to the client in he way that we already know.
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data); //sending the data to the client
  // });
});
// // Starting the server
// server.listen(8000, '127.0.0.1', () => {
//   console.log('Listening...');
// });

//2) soln 2:The prob with this mthd is that our readable stream, so the one we are using to read the file from the disk
// is much much faster than actually sending the result with the response writable stream over the network. And this will
// overwhelm the response stream , which can not handle all this incoming data so fast. And this problem is called back-
// pressure. And it's a real problem that can happen in real situations. So in this case, backpressure happens when the
// response cannot send the date nearly as fast as it is receiving it from the file.
server.on('request', (req, res) => {
  // // Soln 2: Using streams: The idea here is that we actually don't need to read the data from the file into a variable
  // // as the 1st mthd. So instead of reading the data into a variable, and having to store that variable intomemory, we
  // // will just create a readable stream. Then as we receive each chunk of data, we send it to the client as a response
  // // which is a writable stream. So let me show u how we can use streams.
  // //a)
  // const readable = fs.createReadStream('test-file.txt'); // This creates a stream from the data in the 'test-file.txt',
  // // which can then be consumed piece by piecei.e chunk by chunk
  // //b)
  // readable.on('data', (chunk) => {
  //   // we handle this piece of data by writing it to a writable stream, which is the response.
  //   res.write(chunk); // With this we are streaming the content of this file right to the client.
  // });
  // //c) Handling the data when all has been read from the file
  // readable.on('end', () => {
  //   res.end();
  // });
  // readable.on('error', (err) => {
  //   //d) U can simulate this part of error by doing "const readable = fs.createReadStream('testtt-file.txt');"
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found');
  // });
});

// // Starting the server
// server.listen(8000, '127.0.0.1', () => {
//   console.log('Listening...');
// });

//3) soln 3:
server.on('request', (req, res) => {
  //Soln 3: The secret here is to actually use that pipe operator that i mentioned in the last video. So the pipe operator
  // is available on all readable streams, and it allows us to pipe the output of a readable stream right into the input of
  // a writable stream. And that will then fix the problem of the backpressure bcos it will automatically handle the speed
  // basically of the data coming in, and the speed of the data going out.

  //a)
  const readable = fs.createReadStream('test-file.txt'); // This creates a stream from the data in the 'test-file.txt',
  //b)
  readable.pipe(res); // Using the pipe() to put in a writable stream
});

// Starting the server
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});
