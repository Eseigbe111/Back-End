// In this lecture, u're gonna learn an easy way of defining parameters right in the URL, how to
// then read these parameters, and also how to respond to them.

//  Now we want to actually implement in this lecture is a way of getting only one tour. So right now, we have this endpt here "127.0.0.1:3000/api/v1/tours",
// which gives us all the tours and we want to have smth like this "127.0.0.1:3000/api/v1/tours/5" with an ID of the tour,where 5 is the ID.So this is just
// like we talked about in the REST API lecture, where i said if we hit this endpt "127.0.0.1:3000/api/v1/tours" without any ID, then we will get all the
// tours. But if we would specify an ID after that like this "127.0.0.1:3000/api/v1/tours/5", and ofcourse not only an ID but any unique identifier, but in
// this case, the easiest way of implementing it to just use IDs.  So the ID part of the uRl is a variable, it could be anything. So what we can do is to
// define a Route that can accept a variable

/// U WILL NEED TO WATCH THIS VIDEO TO SEE AND DO WHAT HE DID BCOS
// I WILL NOT BE ABLE TO WRITE THEM DOWN BCOS IT WAS DONE IN THE
// POSTMAN APP.

const fs = require('fs');
const express = require('express');

const app = express();

// EXPRESS MIDDLEWARE
app.use(express.json());

//////

// Reading file from dev-data, this is possible bcos it is a top level code
// We parse it immediately with JSON.parse so it can be converted to an array of Javascript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//1) Handling the GET request
// It is a good practice to specify the API version i.e v1 in case u want to o sm changes to ur API, u
// can simply do that in v2, without breaking everyone using v1
app.get('/api/v1/tours', (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  res.status(200).json({
    status: 'success',
    results: tours.length, // We can do this bcos tours is an array
    data: {
      tours: tours // or u can just write turs since the key and value have the same name
    }
  });
});

/// ////// This is for this lecture
//3) Responding to URL parameters
// Now we do the below by adding a column like this ":id", but it could ofcourse be anything else, like "var" or "x"
// app.get('/api/v1/tours/:id/:x/:y?', (req, res) => {
app.get('/api/v1/tours/:id', (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  console.log(req.params); // This is where all the parameters of all the variable that we define in the URL are stored.
  // We can also define more like this "app.get('/api/v1/tours/:id/:x/:y', (req, res) =>{})", and we will get their values.
  // Now we could use an optional Routing so we do not run into error when we do not specify another variable And we do
  // this by using "?" in front of the variable we want to te optional like this "app.get('/api/v1/tours/:id/:x/:y?', (req, res) =>{})".
  // So now if we do not specify the value of the ":y", we will not have any error.

  //a) Converting the id to a number
  const id = req.params.id * 1; // multiplying the id by 1( a number), to convert it to a number
  //b)Checkng if the ID is valid in the tours
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  //c) Getting the "id" fromt he URL
  const tour = tours.find(el => el.id === id); // This will loop over all the elements for each iteration, and will
  // return either true or false. Now what the find() will then do is to create an array of elements which only contains the
  // element where "el.id === req.params" turns out to be true.
  // OR we can do the below for b and c:
  /* 
  const tour = tours.find(el => el.id === id);
  if (!tour){
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid ID'
      });
  This will be still correct just like the above
  */

  //d)Sending the res to the client
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour // or u can just write turs since the key and value have the same namei.e tour
    }
  });
});

//////////
//2)Handling the POST request:
app.post('/api/v1/tours', (req, res) => {
  //console.log(req.body); // This body ppt is available on the req, bcos we used the MIDDLWARE
  // *****Now we want the "res.body" to persist in the tours.json file******:
  //a) The 1st thing to do is to figure out the id of the new object:

  const newId = Number(tours[tours.length - 1].id) + 1;
  //b) Creating a new tour
  const newTour = Object.assign({ id: newId }, req.body); // we could also had done req.body.id =newId,but i did not
  // want to mutate the original body object. So this is the new tour.
  //c) Pushing this new tour into the tour array
  tours.push(newTour); //"tours" is the array of the 9 tours we have at the moment
  //d) Persisting the newTour into the
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), // we contvert "tours" to .json bcos it is just a javascript file
    err => {
      // What do we want to do as soon as the file is writen ? Well what we usually do is to send the newly created object
      // as the response.
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      }); // while 201 stands for created and 200 stands for success
    }
  );
});

////////
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// COMMENTs
