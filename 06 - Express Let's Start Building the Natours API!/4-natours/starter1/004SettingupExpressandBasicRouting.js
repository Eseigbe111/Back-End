// Let's now finally set up Express, create a simple server, and do sm basic routing, just to get an initial feeling of how we actually work in Express.

/// U WILL NEED TO WATCH THIS VIDEO TO SEE AND DO WHAT HE DID BCOS
// I WILL NOT BE ABLE TO WRITE THEM DOWN BCOS IT WAS DONE IN THE
// POSTMAN APP.

//1) Here start by running "npm init" and creating our package.json file. Just as we did in the Javascript course
// 2) we installed express version 4 by doing "npm i express@4"

//3)// This imports the mudule of express
const express = require('express');

//4) We create a variable called app. Again this is a kind of a standard
// We assign it the result of calling express. This adds a bunch of mthds to our app variable below
const app = express();

//5)Defining route: We defined route in the NODE FARM project already. But this is actually dift while
// using express. Rememeber that Routing means to determine how an application responds to a certain
// client request, so to a certain URL, http mthd which is used for that request.
// The below is how we do it:
//a) Doing a get()
app.get('/', (req, res) => {
  // We just want to send a response
  // res.status(200).send('Hello from the server side!'); // With this we send a string to the client
  res
    .status(200)
    .json({ message: 'Hello from the server side!', app: 'Natours' }); // we can also send json to the client
});
//////
//NB: By using "json()",this will automatically set our content type to application/json. So remember that we did
// that manually in the NODEFARM app when we created our very simple API. But Express takes that work away from us.
// To see this on POStman, click away from Body, to Headers, then u will see content-type set to "application/json; charset=utf-8"
/////////

//b) Doing a post()
app.post('/', (req, res) => {
  res.send(`You can port to this endpoint...`);
});
//////
//NB: By using "json()",this will automatically set our content type to application/json. So remember that we did
// that manually in the NODEFARM app when we created our very simple API. But Express takes that work away from us.
// To see this on POStman, click away from Body, to Headers, then u will see content-type set to "application/json; charset=utf-8"
/////////

//Starting up a server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
