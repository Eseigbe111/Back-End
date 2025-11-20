//For this lecture:
// Let's now actually start to learn how to solve callback hell by using promises.
// We are gonna start off by using a promise for the http request instead of the callback

//we will be using an API in this lecture "https://dog.ceo/api/breed/image/random". This Api contains dift dog breeds

//Getting the file sys. module
const fs = require('fs');
// Now inside this callback fc, we want to do that HTTP request that we just talked about b4.
// And there's acctually ways of doing it with native Node.js modules. But it is easier to just
// use an NPM package for that. The one we are going to use is "Super Agent".Later on we're gonna
// use another one. To download this module, we will need to create our package.json file

//We use the superagent by doing the below:
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);
  /// A promise basically implements the concept of a future value.So basically a value that we are expectig to receive
  // smt in the future. The state of a promise in the beginning is a pending promise, since it has not gottenback with
  // any data. As soon as it comes back with a data, it is called a resolved promise. However, a resolved promise might
  // not be successful bcos there might have been an error. So we say a resolved promise can either be fulfilled or rejected.
  // The fulfilled promise actually has a result that we want to use While a rejected promise is when there was an error.
  // We use the catch() as seen below to handle errors in case of any

  //1)Doing a get request with the get()
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    ///We consume the promise using the then()
    .then((res) => {
      console.log(res.body.message);
      //For doing th below HTTP request, we needed the "data" that we got b4, to do the request we
      // have in the callback fc of the readFile().
      // Now we will add another one, bcos we want to save the string gotten from "console.log(res.body.message)"
      // into a new text file
      fs.writeFile(
        'dog-img.txt',
        res.body.message, // This is the data we want to save to dog-img.txt
        (err) => {
          if (err) return console.log(err.message); // This is if an error occurs
          console.log('Random dog image saved to file');
        }
      );
    })
    .catch((err) => {
      console.log(err.message);
    });
});
// So the above is how we consume promises. So we started with the get(), which returned a promise. And we chained
// the then() which handles basically the successful case, and then in the end, we also chain the catch() which handles
// the unsuccessful i.e rejected promise.
