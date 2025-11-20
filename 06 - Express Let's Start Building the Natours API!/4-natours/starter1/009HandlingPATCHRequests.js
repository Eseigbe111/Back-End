// In this lecture, We will how to handle a PATCH request to actually update data

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

//3) Responding to URL parameters
// Now we do the below by adding a column like this ":id", but it could ofcourse be anything else, like "var" or "x"
// app.get('/api/v1/tours/:id/:x/:y?', (req, res) => {
app.get('/api/v1/tours/:id', (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  console.log(req.params); // This is where all the parameters of all the variable that we define in the URL are stored.

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

/////////  This is for this lecture
//4) Handling a PATCH request
// Remember that we actually ave two http mthds to update data: we have "put" and "patch". With "put", we expect that our application
// receives the entire new update object and with "patch", we only expect the ppts that should actually be updated on the object. Usually
// i like to use "patch", bcos i find it easier to simply update the ppts that were updated.
app.patch('/api/v1/tours/:id', (req, res) => {
  // So what do we want to do when there is a patch request i.e so when we want to update the data? Well actually, i'm not really gonna
  // implement this operation here, bcos that's just a matter of writing sm more javascript that is not really important, bcos, again.
  // This is just testing APi-using files. In the real world, we're never gonna use files for that. I am using this verbs here so  u get
  // a good idea of the dift words that we use with http, the kind of status codes that we send back, for e.g, we sent status codes of
  // 200, 201, 400, 404 , sendng data  etc and so on. So it is the basic stuf i want u to learn. So the basics of working with the Express,
  // of courseand also the correct way of sending back API responses.

  //a)Checking if id is valid for the current tour.
  // This req.params.id * 1 is converting it to a number
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  //So we will just send back a standard response. In our main project, we will do all those in full.
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>' // In this position, we are to send back the updated tour(i.e tour: tour OR tour), but bcos of wat i already explained, i will just
      // send back a string
    }
  });
});

////////
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// COMMENTs
