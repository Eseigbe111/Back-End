//smw=> somewhere

// In this lecture, i want to show u a couple of dift things involving modules.
// And i want to start by basically proving to u that Node does in fact wrap the code in our modules into a wrapper fc,
// like i showed u in the last lecture.

// console.log(arguments); // So arguments is an array in javascript that contains all values that were passed into a fc.
// So if we see a value in the above log, it then means it is really a fc

// console.log(require('module').wrapper); // the wrapper fc

////////
/// IMPORTING AND EXPORTING DATA
//Now the most important thing that i wanna show u is how we can export and import data from one module into the other.
// Importing the Calculator
const C = require('./test-module-1');

//1) USing the imported class from an export using module.exports()
const calc1 = new C(); // creating a new instance of our calculator
console.log(calc1.add(2, 5));

///////

//2) Using the export alone without the module i.e only export
//we will get basically access to this exports object
const calc2 = require('./test-module-2');
console.log(calc2.add(2, 5));
console.log(calc2.multiply(2, 5));
//console.log(calc2);

/// We can do sm destructuring with the above.
const { add, multiply } = require('./test-module-2'); // We can import the ones we want
console.log(multiply(3, 5));

/////////

//3) CACHING:
// Calling the fc right away from our test-module-3.js
require('./test-module-3')(); // Using IEFE
require('./test-module-3')(); // Using IEFE
require('./test-module-3')(); // Using IEFE
/* 
This is the result
Hello from the module
Log this beautiful text 😎 
Log this beautiful text 😎
Log this beautiful text 😎

The above logged the fc we called 3times, but we only have hello from the module once> This is bcos of caching. So technically 
this module was loaded once, and so the code inside of it was also executed once only. And so that's why this "Hello from the module"
was only executes once. And the other 2 logs after the first  "Log this beautiful text 😎" came from cache, so they were 
stored smw in the Node's processes cache. And once we called the fc for the 2nd time, it was simply retrieved from there 
instead ofloading the module again.

*/
