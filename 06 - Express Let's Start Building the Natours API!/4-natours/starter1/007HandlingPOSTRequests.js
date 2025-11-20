// In this lecture, we will implement a route Handler for POST request so that we can actually add a
// new tour to our data set.

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

// Handling the GET request
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

//////////
//Handling the POST request:
// Just as we talked in the API lecture, the URL is exactly the same. No matter if we want to get all the
// tours, or if we want to create a new tour. The only thing that changes is the HTTP mthd i.e GET or POST,
// we use for doing the requests.
// With the POST request, we can send data from the client to the server. This data is then ideally available
// on the request. The request object again is what holds all the data about the request that was done. If that
// request contains sm data that was sent, that data should be on the request.
// Now out of the box, Express does not put that body data on the request, and in order to have that data available
// we have to use smth called "MIDDLEWARE". We will talk about this in other lectures, but for now we need to
// include a simple MIDDLEWARE at the top of our code doing "app.use(express.json)". use(express.json) is the MIDDLEWARE
// This is a fc that can modify the incoming request data.
app.post('/api/v1/tours', (req, res) => {
  //console.log(req.body); // This body ppt is available on the req, bcos we used the MIDDLWARE
  // *****Now we want the "res.body" to persist in the tours.json file******:
  //a) The 1st thing to do is to figure out the id of the new object:
  // Now remember, again in the lecture about REST API's, is that when we create a new object, we never specify the id
  // of the object. The database usually takes care of that. So a new object usually, automatically get it's new id. Well
  // in this case, we do not have any database, and so what we're gonna do is to simply take the id of the last object
  // and then add +1 to that.
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
  ); // we used writeFile() and not writeFileSync(), bcos we want to pass in a callback fc that is giong to
  // be processed in the background and as soon as it's ready it's gonna put its event in one of the event loop queque,
  // which is then giong to be handled as soon as the event loop passes that phase. Also we do not want to block the event
  // loop.
  // res.send('Done'); // We always need to send back smth in order to finish the so-called request/response cycle
});

////////
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// COMMENTs
/* After this part :
app.post('/api/v1/tours', (req, res) => {
  console.log(req.body); 
    res.send('Done'); 
    });
we went into POStMAN app to do the reamining part by first creating a POST request, saving it and then sending the request,
after which we made the "req.body" to persist our "tours.json" file (it's actually a fictional database)
*/
