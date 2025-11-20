//Let's now refactor our code a little bit. So basically, reorganize sm of our route tomake the code a lot better.

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

/* This is for this lesson
Now we have all these routes,so the http() and the url together with the route handler, which is the callback fc below:
res.status(200).json({
    status: 'success',
    results: tours.length, 
        data: {
      tours: tours
       }
  });

Now, we have these route and route handlers kind of all over the place. And its kind of difficult to see what route we 
actually have in our code. So all the route should kind of be together, and then the handler fcs also together. So what 
i am going to do is to basically export all of these handler fcs into their own fc.

*/

///// Fc for Handling the GET request
const getAllTours = (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  res.status(200).json({
    status: 'success',
    results: tours.length, // We can do this bcos tours is an array
    data: {
      tours // or u can just write tours:tours
    }
  });
};

//// Fc for Responding to URL parameters
const getTour = (req, res) => {
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
};

///////2)Fc for Posting request:
const createTour = (req, res) => {
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
};

///Fc for Handling a PATCH request
const updateTour = (req, res) => {
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
      tour: '<Updated tour here...>' // In this position, we are to send back the updated tour(i.e tour: tour OR tour), but
      // bcos of wat i already explained, i will just send back a string
    }
  });
};

//// Fc for Handling Delete request.
const deleteTour = (req, res) => {
  //a)Checking if id is valid for the current tour.
  // This req.params.id * 1 is converting it to a number
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null // The data is null to show that the data no longer exists
  });
};
////////
//1) Handling the GET request
// app.get('/api/v1/tours', getAllTours);
///
//3) Responding to URL parameters
// app.get('/api/v1/tours/:id', getTour);

//////////
//2)Handling the POST request:
// app.post('/api/v1/tours', createTour);

//4) Handling a PATCH request
// app.patch('/api/v1/tours/:id', updateTour);

////////
////5) Handling Delete request.
// app.delete('/api/v1/tours/:id', deleteTour);

// This is for this lecture
/// The above looks nicer already but it's still not perfect. We can do even better. Bcos let's say, that we want to, for e.g
// change the version or the resource name in all of the five places above, we would have to change it in all of the five places
// above and that is not ideal. And so instead of having all the above, we can do smth better by chaining the fcs together as
// seen below:

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// So with the above, we did not repeat this '/api/v1/tours' twice and also we did not repeat '/api/v1/tours/:id' trice

////////
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
