//In this lecture, Let's start to implement sm routes for the user's resource.

/// U WILL NEED TO WATCH THIS VIDEO TO SEE AND DO WHAT HE DID BCOS
// I WILL NOT BE ABLE TO WRITE THEM DOWN BCOS IT WAS DONE IN THE
// POSTMAN APP.

const fs = require('fs');
const express = require('express');

/// This is or this lecture
// So, our API will have a couple of different resources. The 1st one that we already talked about and started to
// implement is the tours resource. But another one will be users' resource. So that for e.g, we can create user
// accs, and have dift users route and all that good stuff that comes with users.
// Now ofcourse, for now, this users' resource will be very similar to the tours resource. But i still want to start
// implementing this resource at this pt bcos we need to move forwardin the project and also bcos i need it in order
// to prepare for what i'm gonna teach u next.

const app = express();
///////A) ALL MIDDLEWARES

// 3rd-PARTY MIDDLEWARE
const morgan = require('morgan');
app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce

// EXPRESS MIDDLEWARE
app.use(express.json());

//CREATING OUR MIDLEWARE FC
app.use((req, res, next) => {
  //a) Doing what we want in the code
  console.log('Hello from the middleware 👋');

  //b) Using the next()
  next();
});

//we can create difft numbers of middleware fc.
//2) 2nd Middleware fc:  In this one below, we want to alter the res()
app.use((req, res, next) => {
  //a) Doing what we want in the code
  req.requestTime = new Date().toISOString(); // Wgat we ae doing here is just to add the current time to the request
  //b) calling the next()
  next();
});
//We can now pass the req.requestTime into our fcs i.e getAllTours, getTour etc

///////
// Reading file from dev-data, this is possible bcos it is a top level code
// We parse it immediately with JSON.parse so it can be converted to an array of Javascript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

///B) ALL ROUTE HANDLERS
///// Fc for Handling the GET request
const getAllTours = (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime, // Seding the req.requestTime as a response to the client
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

/// This is or this lecture
//// Fc for Handling getAllUsers
const getAllUsers = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
//// Fc for Handling createAllUsers
const createAllUsers = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
//// Fc for Handling getUser
const getUser = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
//// Fc for Handling updateUser
const updateUser = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};
//// Fc for Handling deleteUser
const deleteUser = (req, res) => {
  // 500 means internal server error
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined'
  });
};

////////
///C) ROUTES

app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

/// This is or this lecture
// So, our API will have a couple of different resources. The 1st one that we already talked about and started to
// implement is the tours resource. But another one will be users' resource. So that for e.g, we can create user
// accs, and have dift users route and all that good stuff that comes with users.
// Now ofcourse, for now, this users' resource will be very similar to the tours resource. But i still want to start
// implementing this resource at this pt bcos we need to move forwardin the project and also bcos i need it in order
// to prepare for what i'm gonna teach u next.

// So the fcs for the below, which i will be creating above will do nothing. I just want u to get an idea of how  we
// do these later
app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createAllUsers); //so when we do a "get" or a "post" without an "id" i.e just like '/api/v1/tours',
//it means that we either want to get all the users, so basically, all the objects that are part of a resource, and if we use
// post, then we want to create a new resource on a server.So its the same pattern as the above for the routes.

app
  .route('/api/v1/users/:id') // This means we wan to get just one user
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

////////D) STRAT SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
