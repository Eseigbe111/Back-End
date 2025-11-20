const fs = require('fs');

//Importing the Tour from tourModel
const Tour = require('./../models/tourModel'); // "./"=> current folder, "../"=>Go up 1 folder

/////////
///// Fc for Handling the GET request
exports.getAllTours = (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime, // Setting the req.requestTime as a response to the client
    // results: tours.length, // We can do this bcos tours is an array
    // data: {
    //   tours, // or u can just write tours:tours
    // },
  });
};

//// Fc for Responding to URL parameters
exports.getTour = (req, res) => {
  // The callback fc (req, res)={} is called the route handler
  // console.log(req.params); // This is where all the parameters of all the variable that we define in the URL are stored.
  //a) Converting the id to a number
  const id = req.params.id * 1; // multiplying the id by 1( a number), to convert it to a number

  //c) Getting the "id" fromt he URL
  // const tour = tours.find((el) => el.id === id);

  // //d)Sending the res to the client
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: tour, // or u can just write turs since the key and value have the same namei.e tour
  //   },
  // });
};

//ThIS IS FOR THIS LECTURE:
//2)Fc for Posting request:
exports.createTour = async (req, res) => {
  try {
    //Remember we created a tour by doing the below in a couple of lectures back:
    // const newTour = new Tour({})
    // newTour.save()
    //BUT WE CAN DO BETTER:The below will do the exact main thing as the above. The main diff is that with the version
    //below we basically call the mthd directly on the Tour, while the one above we called the mthd on the new doc.
    // Now the below will return a promise also. So as i promised u, instead of using then() to handle the promise,
    // i will start to use the async/await

    const newTour = await Tour.create(req.body); // we pass the req.body bcos that is what contains what we are interested in
    // i.e the data that comes from the POST() request. Again, the data that comes from the the POST body. And so that's stored
    // inside of req.body

    // while 201 stands for created and 200 stands for success
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
    // Handling errors that can occur
  } catch (err) {
    // VALIDATION ERROR :If we try to create a doc, without one of the fields we put as required, the promise will be rejected.
    // So if we have a rejected promise, then it will enter the catch block. And so in this catch block, we want to send back a
    // response saying there was an error.
    //400 stands for bad request
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!', // For now we will handle this error like this but late, we will learn how to handle these errors
    });
  }
  // To test this, we used the POStman app and used the the "Create New Tour" we saved already.
  // WATCH THIS AGAIN TO SEE HOW JONAS TESTED IT USING THE Postman app
};

////End Here

///Fc for Handling a PATCH request
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>', // In this position, we are to send back the updated tour(i.e tour: tour OR tour), but
      // bcos of what i already explained, i will just send back a string
    },
  });
};

//// Fc for Handling Delete request.
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null, // The data is null to show that the data no longer exists
  });
};
//smo=> someone

// THIS IS FOR THIS LECTURE: For this lecture, i connected to my local database, bcos
// So u already learnt how to create new documents inthe database. But in this lecture, i'm gonna to show u an easier and even better way
// of doing so, as we implement our create tour handler i.e createTour().
// So at this pt our API basically doesn't do anything anymore. It doesn't work anymore, bcos basically we deleted all the fclty that we
// had in the last video. And we did so, so that over the next couple of lectures we can rebuild it using a real databases, so basically
// finally building our real API. And we're gonna start by implementing the createTour() fc which is the handler fc that is called as soon
// as there is a POST() request to the tours route.

// We will also remove the checkBody(), which was basically to validate the body. So to see if it had the name or price ppt in them. But
// now our "mongoose" is going to actually going to take care of that. And also we remove it from the tourRoute.

// So we will be creating the createTour(), which is the one that will get called as soon as smo hits the "tourRoute" with a POST request.

//Now our eslint was giving us lines in our codes like errors. So to rectify it jonas went into the package.json file and added this part:
/* 
"engines": {
"node": ">=10.0.0"
}
And it rectified itself.

Temple: For me, my eslint is not functning now, but i will rectify it after the course.
*/
//
