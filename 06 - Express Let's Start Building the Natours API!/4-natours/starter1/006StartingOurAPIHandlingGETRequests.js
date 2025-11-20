//smb =>somebody

// In this course, we will actually start to build our main course project.
// We will build an API that we will start to use in this lecture.
// WE start by building a route Handler for the GET request
const fs = require('fs');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

//////

// Reading file from dev-data, this is possible bcos it is a top level code
// We parse it immediately with JSON.parse so it can be converted to an array of Javascript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Handling the GET request
// It is a good practice to specify the API version i.e v1 in case u want to o sm changes to ur API, u
// can simply do that in v2, without breaking everyone using v1

app.get('/api/v1/tours', (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  //Now when smb hits this route "api/v1/tours", we want send back all the tours as seen below:.
  // The tours are in the dev-data folder. It is an array of json object which then has a bunch of data
  // about each of the tours. And that's the data we will be sending to the client. B4 we can send this
  // data to the client, we actually need to read it. We don't do it in the route handler but outside it.

  // sending the tours to the client.
  //Now i add the results prameter, whenever i send multiple responses.Now this is not really part of the
  // json specification, but i still really like to do it bcos that makes it very easy for the client to
  // get a very quick information about the data it is receiving
  res.status(200).json({
    status: 'success',
    results: tours.length, // We can do this bcos tours is an array
    data: {
      tours: tours // or u can just write tours since the key and value have the same name
    }
  });
});

////////
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
