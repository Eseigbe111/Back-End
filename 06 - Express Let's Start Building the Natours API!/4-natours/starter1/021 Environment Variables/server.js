//envmt=> environment
//envmtl=> environmental
/// Importing the app

const dotenv = require('dotenv');
// This is for this lecture: Evironment variable
dotenv.config({ path: './config.env' });

const app = require('./app');

////
// This is for this lecture: Evironment variable
// The 'env' variable is set by Express
// console.log(app.get('env')); //This is to check which envmt we are in.

//Dift envmt variable set by Nodejs
//console.log(process.env);
// The variables gotten from the log of "process.env" come from the process core module, and were set at the moment that the process started.
// And as u can see, we didn't have to require() the proces module. It is simply available everywhere automatically.
// Now in express, many packages depend on a special variable called NODE_ENV. So it's a variable that's kind of a conventn, which should define
// whether we're in devpt or in production mode. However, Express does not automatically define this variable and so we have to do that manually.
// And there are multiple ways to do it, but let's start with the easiest one, which is to use the terminal. To set an evmt variable for a process
// we need to pre-pend that variable to this "nodemon server.js" i.e we do: "NODE_ENV=development nodemon server.js". I used "$env:NODE_ENV="development"; nodemon server.js",
// bcos i am using powershell, dift from what Jonas is using. This "$env:NODE_ENV="development"; nodemon server.js" gives the same result as console.log(process.env);.
// Now we can actually define even more if we wanted, for e.g "NODE_ENV=development X=23 nodemon server.js", but for me i did the below:
/* $env:NODE_ENV = "development"   ← press Enter
$env:X = 23                      ← press Enter
nodemon server.js               ← press Enter
*/
// From the log, u will see that X=23, as we set it to be. So again many packages that we use for Express devpt actually depend on envmt variable.
// And so when our project is ready and we are gonna deploy it, we then should change the NODE_ENV variable to prodn.

// We also use envmt variables like "configuratn settings" for our applicatns. So whenever our app needs sm configuratn for stuff that might change
// based on the envmt that the app is runnind in, we use envmt variables. For e.g we might use dift databases for devpt and for testing until we could
// define one variable for each and then actuvate the right database according to the envmt. Also we could send sensitive data like passwords and
// user name using envmt variables. Now its not really practical to always define all of these variables in the command where we start the application.
// So imagine we had like 10 envmt variables and it would be not really practical to having to write them out all here inside of the command in the
// terminal i.e on the line line "NODE_ENV=development X=23 nodemon server.js". And so instead what we do is to create a configuratn file. So now let
// me create a config.env file and show us what i mean. So ".env" is actually the conventn for definning a file which have these envmt variables.
// So now let's define the variabes that we ran on the terminal in the file and run them as seen below:
/* we type the below inside the config file
NODE_ENV = "development" 
PORT=3000
USER="Temple"
PASSWORD=123456
//As u can see the variable names are always in Capital. 
*/
// To connect this config.env file to ur Node application, and reading them as envmt variables, we will need to use an npm package called ".env". So we
// install it by doing "npm i dotenv" and then require it in our server.js as seen above: require('dotenv') and then use it like this "dotenv.config({path: './config.env'})".
// we can do 'npm start'.

// And just to finsh, lets now actually go ahead and use the NODE_ENV variable and also the port variable. And to do that we will need to go into our "app.js"
// file and run the "logger MIDDLEWARE" only when we are in devpt so that i does not run when we are producing. so we will do the below in our app.js as seen below:
/* 

if(process.env.NODE_ENV ==='development'){
  app.use(morgan('dev')); 
}
// EXPRESS MIDDLEWARE
app.use(express.json());

So after the above we come back to the server.js and make the port to be either the one coming from the environment variables or the 3000 we had b4. so we can see 
the change below : 
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

*/

/// And Finally as the last test, let's add a new start script to our package.json for production like this:
/* 
"scripts": {
    "start:dev": "nodemon server.js",
    "start:prod": "NODE_ENV=production nodemom server.js",
  },

  For the above, ChatGpt helped me. I had to istall "npm install --save-dev cross-env" and also wrote my script using "cross-env" as seen below:

  "scripts": {
  "start:dev": "nodemon server.js",
  "start:prod": "cross-env NODE_ENV=production nodemon server.js"
}


*/

/////

// STRAT SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
