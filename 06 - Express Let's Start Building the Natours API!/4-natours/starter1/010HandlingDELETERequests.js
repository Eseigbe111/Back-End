// In this lecture: Finally, let's now handle Delete requests as well.

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

//4) Hading a PATCH request
// Remember that we actually ave two http mthds to updata data: we have "put" and "patch". With "put", we expect that our application
// receives the entire new update object and with "patch", we only expect the ppts that should actually be updated on the object. Usually
// i like to use "patch", bcos i find it easier to simply update the ppts that were updated.
app.patch('/api/v1/tours/:id', (req, res) => {
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
      tour: '<Updated tour here...>' // In this position, we are to send back the updated tour(i.e tour: tour OR tour), but bcos of wat i already
      // explained, i will just send back a string
    }
  });
});

////////
////5) This is for this lecture
// Handling Delete request. And just like in the previous lecture, I will not actually implement the deleting of a resource in our route handler.
// Again its not necessary here bcos we are only dealing with file which is not a real world scenario
app.delete('/api/v1/tours/:id', (req, res) => {
  //a)Checking if id is valid for the current tour.
  // This req.params.id * 1 is converting it to a number
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  //So we will just send back a standard response. In our main project, we will do all those in full.
  // The status code for a delete request is a 204 (which means no content). This is bcos as a result usually, we do not send any data back, instead we
  // just send null
  res.status(204).json({
    status: 'success',
    data: null // The data is null to show that the data no longer exists
  });
});

////////
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// COMMENTs
