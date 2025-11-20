// In this lecture, As promised, we now use event emitters and listeners in practice.

// So to use the built-in node events module, se need to require the events module and from that we are going to require an EventEmitter class.
const EventEmitter = require('events');
const http = require('http');

// Creating an instance of the EventEmitter
// const myEmitter = new EventEmitter();

//1) Using the listener like that
// One good thing about these emitters, is that u can set multiple listeners on the same event
// CREATING AN EVENT by using the .on()
// myEmitter.on('newSale', () => {
//   console.log('There was a new sale');
// }); //adding a event listener

// myEmitter.on('newSale', () => {
//   console.log('Customer name: Jonas');
// }); //adding a event listener

// //LISTENING TO THE EVENT CREATED by using the .emit()
// // The emit() is just like we are clicking on a btn, and so we have to set up listeners b4 emitting
// // myEmitter.emit('newSale'); // This means we want to emit an event called newSale.

// //////
// //2) Passing argument in the listener
// // We can even pass arguments to the event listener by passing them as an additional argument in the emiiter
// myEmitter.on('newSale', (stock) => {
//   console.log(`There are now ${stock} items left in stock.`);
// });

// myEmitter.emit('newSale', 9);

///NB : This pattern we used above is very good and works perfectly fine. But if we are to use this pattern in real life, then it's a best practice
// to create a new class that will actually inherit from the node EventEmitter as seen below:
//////////
// USING A CLASS THAT WILL BE INHERITED FROM
// So in broad terms, the EventEmitter is a class, so the one that we imported from the require('events') and the "sales" class is the one we are
// creating and that inherits everything from the "EventEmitter".Then in ES6, each class gets a constructor which is a fc that is run as soon as we
// create a new object from a class.

class Sales extends EventEmitter {
  constructor() {
    super(); // We always call super() each time we extend from another class, and by doing this we then get
    // access to all the mthds of the parent class which in this case is EventEmitter()
  }
}

// Creating an instance of the EventEmitter
const myEmitter = new Sales();

//1) Using the listener like that
// One good thing about these emitters, is that u can set multiple listeners on the same event
// CREATING AN EVENT by using the .on()
myEmitter.on('newSale', () => {
  console.log('There was a new sale');
}); //adding a event listener

myEmitter.on('newSale', () => {
  console.log('Customer name: Jonas');
}); //adding a event listener

//LISTENING TO THE EVENT CREATED by using the .emit()
// The emit() is just like we are clicking on a btn, and so we have to set up listeners b4 emitting
// myEmitter.emit('newSale'); // This means we want to emit an event called newSale.

// //////
//2) Passing argument in the listener
// We can even pass arguments to the event listener by passing them as an additional argument in the emiiter
myEmitter.on('newSale', (stock) => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit('newSale', 9);

//////////////////////ANOTHER e.g
// Creating a server
const server = http.createServer();

// Listening to events on the server
server.on('request', (req, res) => {
  console.log('Request received!');
  console.log(req.url); ///NB: we did this to exmine why it logged twice on the terminal
  //So we have one log for the root URL "/" and another for the favicon.ico "/favicon.ico".
  // So browsers automatically ty to request a favicon for each websites, so that is why
  // each of these i.e  'Another request 😊' and 'Request received' appeared twice.
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Another request 😊');
});

// The Close Event is an evet u listen to, when the server closes down
server.on('close', () => {
  console.log('Server closed');
});

// Starting a Server
server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...');
});

//Making a Request on '127.0.0.1' URL:
// To make a "request", u go to ur browser, open a tab and
// enter "127.0.0.1:8000"  and click enter

//NB: So we have one log for the root URL "/" and another for the favicon.ico "/favicon.ico".
// So browsers automatically ty to request a favicon for each websites websites, so that is why
// each of these i.e  'Another request 😊' and 'Request received' appeared twice. So it not
// always that we have to actually emit events, that is more when we try to use the EventEmitter
// on our own i.e when we are trying to use our custom events in our applications. In our own
// case we have to "emit" the events ourself, but if we are using a built in node module, then
// these fcs in there will many times emit their own events and all we have to do is listen to them.
