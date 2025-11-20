//envmts=> environments
//prodn=>production

/// NOW IF U HAVE ANY ISSUES WITH THE CODES U CAN WATCH THE VIDEOS FOE THE PARTS

// THIS IS FOR THIS LECTURE:=> This lecture is all in the DEBUGGER
// For this, currently the DEBUGGER is now considered deprecated and not recommended for use, so i will try, when going thru the course
// to see if there are other DEBUGGERS i can go thru. ChatGpt said it is currently outdated and not being maintaned.
// In this video, we're gonna learn about debbugging in Nodejs bcos, let's face it, there will always be sm bugs in our code no matter
// how careful we are. And so it's good to have a tool to help us ith debugging our code. Now,this is not really about error handling
// with Express, but i thought this was a good pt in the course to introduce u to a debugging tool which we might then use thruout, the
// rest of the course.
// And there are dift ways of dugging Nodejs code. For e.g, we could use vsc for that. But actually, Google very recently released an
// amazing tool which we can use to debug which is called NDB.
// we install NDB by doing "npm i ndb --g". NDB which stands for node debbuger is actually just an NPM package. Now if u can't install,
// it globally u can still install it as and save it as a dev-dependency like this "npm i ndb --save-dev". As soon as u have it installed,
// let's head over to package.json to add a new script like this: "debug": "ndb server.js". To run this, we need to terminate the npm
// start we had bcos it will try to run it on the same port. After which we can then run "npm run debug".
// After running the script, a new chrome window should open, so what's called a headless chrome,but it's not a real chrome. And this will
// then open itself TEMPLE SPEAKING: Mine was a chromium that downloaded.

/// THE DEBUGGER:
// On the left hand side of the debbugger, we have our complete file sys. We also have access to our NPM script below, which we can actually
// run from there. We also have a console and so wehave our ussual outputs witht the app running and the database connectn. And we also have
// the performance and memory tabs, which we're gonna use. Now if u're familiar with the general debugging process then all of this is gonna
// be kinda famliar to u. Then if not, then don't worry, i will show u a couple of techniques thruout this video.
// Now let's open our server.js.And one thing that's really amazing is thar we can actually edit our files in herei.e the debugger. So fore.g,
// let's say we find a bug and we then want tofix it right away. w can do that right in the debugger and then it will then update the original
// code.

// ABOUT debugging
// I would say the fundamental aspect of debugging is to set break pts. So break pts are basically pts in our code that we can define in the
// debugger where our code will then stop . It will basicallly freeze in time and we can then take a look at all our variables. so that will
// then be extremely useful to find sm bugs. Now, right now there's not any bug in here, but let's still add a break pt. And i am going to add
// that break pt in line the that has "app.listen()" in the debugger in our "server.js". so when u click on the the number of that line, we
// will see a green colour marker appeaar. And that means the code will stop and the line no. when we execute it.
// Now aour applicatn is actually already running at this pt and basically wating requests to come in. And so what we need to do here is to
// right click on an empty space in the "server.js" file and then click on "Run this script". This will then basically run the script in the
// debugger again.
// U can see on the right side, that it says "paused on breakpt", and so all the code that is above this breakpt "app.listen()" has already
// executed at this  pt. And so we can take a look at the variables. E.g we can hover the "port" variable and its going to show that it is
// set to 3000. Another way of seeing the variables is on the right side of the debugger just below the "paused on breakpt". And so we have
// of variables there like the Node Processes, Watch, Scope etc.
// In the Scope is where all our variables are. Here u can also see the 5 variable that we have access to in all modules. Remember that from
// our modules lecture: we have the "__dirname i.e directory name","__filename", "require()","module()" and "exports". These are the 5 variables
// that are available in each and evert module.

// Next let's take a look at our "app" varaible, so bsically the Express applicatn that we exported from "app.js". When u click on it u will
// see a ton of stuff, but what i find interesting is to take a good look at the " _router".In this we have the "stack", which is the MIDDLEWARE
// stack that we have in our applicatn. For e.g we ahev the "jsonParser", we also have the code that serves the static files. we slso have the
// logger which commes from using Morgan etc.

//envmt=> environment

// The other thing i wanted to show u is in the "Global variable". In there we have the "process variable", which is available everywhere and that's
// why it is called a global variable. Then in "process variable", we can see the "env variable" also, which is where our envmt variables are stored.
// Under the "env variable", we can see our DATABASE string, DATABASE LOCAL, PASSWORD etc.

//09:12 from the lecture
// CONTINUING with DEBUGGING
// So we stopped the code, we froze it in time at the line where we have "app.listen()". We can then click on the btn on the right hand side that looks
// like a "play" to keep on running the code. And since we have no more break pts, the code will then break no more, and basically finish running. so
// let's click that. And so our applicatn is really running. We take a look at this in the console.

// So let's now quickly do a request in our Postman app "Get All Tours", we will see most of what we logged on our terminal in the console of the DEBUGGER.
// As we do this no response will be displayed initially i.e to gell all the tours. But when we continue the executn of our code, by clicking on the "play"
// like btn in the DEbugger, the response will then be displayed.
// After the deletn of other tours that are not useful, we have 10 tours, let's now set a break pt in the fc that handles this route. i.e the Geall tours.
// To do this, we go to our tourController.js file, and under the getAllTours(), for now all i want to do is to set a breakpt in the fc where we have
// "res.status(200).json()", so that we can take a look at what these variables look like after the query is already done. So the code above this part
// "res.status(200).json()" will get out tours and we will then stop the code basically b4 "res.status(200).json()" i.e sending it as a response. So
// we will click on the line number where this "res.status(200).json()" is found, and then go over to our POstman to send a request for thr "Get All Tours"
// bcos that will then trigger the fc "getAllTours()". Since we have a breakpt, we now move back to where the code has stopped i.e where "res.status(200).json()".

// So, what kind of variables do we have here? At the right hand side of the DEbugger, under the the "Block" and "Local" variable, we will see variables
// that pertain to our code. So, we can see the req, res, features, and the tours varible. So taking a look at the "req", u see that we have all kinds
// of stuff like: baseErl, the mthd i.e "GET", query ets. And so u can see now, how handy this can be in order to debug our code.i.e to freeze our code
// in time instead of having todo all these console.logs() thhat we used to do up until this pt. So usually when we wanted to take a look at lets say the
// query, we would do a bunch of console.logs and use that to figure out  bug in case that smth was not working. But now we have this amazing tool which
// can help us avoid all these console.logs. And again u see all of the ppts and mthds in the "Block" and "Local" variables, they are not really interesting.
// to us for now. What i wanted to show u is of course at this pt "res.status(200).json()", we already have the tours. we can see that actually under the
// "Block=>features=>tours". U can see that the "features" are an instance of the APIFeatures class just as we defind it. And in there we have the query
// and the query string. So this is how we take a look at all the variables, and this is how the most important parts of the Debugger work.

// Now in order to learn a bit about the debugging process, let's introduce a very small bug into our code, and then take a look at how we can use these
// tools that we have here i.e those parts at the top of the Debuggerthat looks like the play btn etc, to basically take a deeper look at our code. So
// i'm now going to click on the "play" like btn to continue the execution of the code. And as  we do that, we will see that inour Postman app, the
// response will be displayed.

//smw=>somewhere
// So in our APIFeatures file, i want to introduce a small bug here in the limitFields() which is not using the space inthe "join("")" as seen below
// "const fields = this.queryString.fields.split(',').join('');",and so this will then give us a wierd result. So we can test this by send this URL in
// Postman like this "127.0.0.1:3000/api/v1/tours?fields=name.duration".So b4 we send a request,we should remove the breakpt we set b4.
// So as we send the request, we will not get the "name" and the "duratn" in the response in Postman. So let's pretend that's our bug now and we're
// now trying to figure out why this is not working. And we know that the error must probably be smw in our limit fields mthd. And so let's basically stop
// the code from executing at this pt ".limitFields()" i.e our breakpt in the "tourController.js". Bcos it is ".limitFields()" the mthd will actually be
// called so from there we can enter the fc. So to activate the Debugging, we go back to Postman and send a request again and then we can start to debug.
// So at this pt ".filter" and ".sort()" have already been executed, so what we can use now is the step tool that is on the same place where the "play" btn
// like figure is. So what step does is that it will basically execute the next line of code. And in this case that will be inside of the limitFields(). As
// soon as we click it, we then move right into the ".limitFields()" fc. So we can use the "step" btn  to move to each part of our code and analyze. So as
// we move we can then see on this part as we hover thru the "fields" in this part "this.query = this.query.select(fields)" that error was due to no space
// btw name and duration i.e its like this "nameduration" while it is supposed to be like this "name duration". So we can correct it here and it will be
// updated in vsc. So we save the correctn and it the reloads and takes us back to entering the fc. And then we click on "step" again, and then as we hover,
// we will see it is correct as it should be i.e the space btw name and duratn. And we click on "step" once more and we will enter the "select()", so we click
// on "step out" (also found close to where our step btn is ) to exit the "select()". So the "select()" we entered was actually running this part "select(fields)".
// So we can continue to click on "step" and see how it enters dift fcs and executes them.
// Note that each time u are in a line of  a fc that line has not been executed,but when u click on step and move to the next line, the prev line is then executed.
// And hovering, u will be able to read or see what it contains.
/////
const morgan = require('morgan');
const express = require('express');
/// IMPORTING THE ROUTERS SO THE MOUNTED ROUTERS CAN WORK
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//////
const app = express();

///////A) ALL MIDDLEWARES
// 3rd-PARTY MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // There are others apart from dev e.g tiny. They have dift formatting of what they produce
}
// EXPRESS MIDDLEWARE
app.use(express.json());
/////
// SERVING STATIC FILE
// let's now learn how to serve static files with Express.
// What are static Files: It's the files that are sitting in our file sys that we currently cannot access using all the routes.
app.use(express.static(`${__dirname}/public`));
/// With the above, we will be serve our html in the browser. Now we will view it using this URL "127.0.0.1:3000/overview.html".

////////

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
///////
///C) ROUTES
//THIS IS CALLED MOUNTING THE ROUTER
app.use('/api/v1/tours', tourRouter); //This is using the tourRouter in our application on the '/api/v1/tours'
app.use('/api/v1/users', userRouter); //This is using the userRouter in our application on the '/api/v1/users'

// Exporting our app so we can get it in server.js
module.exports = app;
