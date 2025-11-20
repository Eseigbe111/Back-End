const fs = require('fs');

// Reading file from dev-data, this is possible bcos it is a top level code
// We parse it immediately with JSON.parse so it can be converted to an array of Javascript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//// This is for this lecture : CReating  a MIDDLEWARE that checks the id
// U can see that in our handler fcs that we use the id, we check if the id is valid. So al the 3 fs
// have the very similar code where they check if the id is valid, and if not, they send back this
// invalid ID response. Now we repeated each of these codes, and u know it is not a good practice to
// repeat code, so what we can do is to use the concept of param MIDDLEWARE as seen below:
exports.checkID = (req, res, next, val) => {
  //a)Checking if id is valid for the current tour using param MIDDLEWARE fc.
  // This req.params.id * 1 is converting it to a number
  console.log(`Tour id is:${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};
///// Now the Handler fcs dont need to worry about validation. Each of the fc below has only one purpose
// which s to do what they say i.e as the fc names.

/////////
///// Fc for Handling the GET request
exports.getAllTours = (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime, // Setting the req.requestTime as a response to the client
    results: tours.length, // We can do this bcos tours is an array
    data: {
      tours // or u can just write tours:tours
    }
  });
};

//// Fc for Responding to URL parameters
exports.getTour = (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  // console.log(req.params); // This is where all the parameters of all the variable that we define in the URL are stored.
  //a) Converting the id to a number
  const id = req.params.id * 1; // multiplying the id by 1( a number), to convert it to a number

  //c) Getting the "id" fromt he URL
  const tour = tours.find(el => el.id === id);

  //d)Sending the res to the client
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour // or u can just write turs since the key and value have the same namei.e tour
    }
  });
};

///////2)Fc for Posting request:
exports.createTour = (req, res) => {
  //console.log(req.body); // This body ppt is available on the req, bcos we used the MIDDLWARE
  //a) The 1st thing to do is to figure out the id of the new object:
  const newId = Number(tours[tours.length - 1].id) + 1;
  //b) Creating a new tour
  const newTour = Object.assign({ id: newId }, req.body);
  //c) Pushing this new tour into the tour array
  tours.push(newTour);
  //d) Persisting the newTour into the
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours), // we contvert "tours" to .json bcos it is just a javascript file
    err => {
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
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>' // In this position, we are to send back the updated tour(i.e tour: tour OR tour), but
      // bcos of wat i already explained, i will just send back a string
    }
  });
};

//// Fc for Handling Delete request.
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null // The data is null to show that the data no longer exists
  });
};
