// In this video, we will promisify the readFile() and writeFile() fcs which means that we will make them
// so that they return promises instead of us passing callback fcs into them.

//we will be using an API in this lecture "https://dog.ceo/api/breed/image/random". This Api contains dift dog breeds

//Getting the file sys. module
const fs = require('fs');

// We got the superagent by doing "npm i superagent"
// We use the superagent by doing the below:
const superagent = require('superagent');

/// A promise basically implements the concept of a future value.So basically a value that we are expectig to receive
// smt in the future. The state of a promise in the beginning is a pending promise, since it has not gotten back with
// any data. As soon as it comes back with a data, it is called a resolved promise. However, a resolved promise might
// not be successful bcos there might have been an error. So we say a resolved promise can either be fulfilled or rejected.
// The fulfilled promise actually has a result that we want to use While a rejected promise is when there was an error.
// We use the catch() as seen below to handle errors in case of any

// Promisifying the fs.readFile()
//Creating a readFilePro fc that returns a new Promise
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    // Calling the fs.readFile()
    fs.readFile(file, (err, data) => {
      // Error occurs if the file could not be found. if an error occurs, we call the reject().
      //And what we pass into the reject fc will be th error that is later avialable in the
      //catch() below
      if (err) reject('I could not find that file 😪');
      resolve(data); // This data is the value that will be available in the then()
      // So calling the resolve() will basically ark the promise as successful i.e fulfilled
      // and return the successful value from the promise.
    });
  });
};

// Promisifying the fs.writeFile()
//Creating a writeFilePro fc that returns a new Promse
const writeFilePro = (file, data) => {
  //Apart from the filename, it also needs the data that will be written into the file
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write file 😪');
      resolve('success');
    });
  });
};

// Consuming the promise returned with then()
readFilePro(`${__dirname}/dog.txt`)
  .then((result) => {
    console.log(`Breed: ${result}`);
    //Doing a get request with the get() and returning it as a promise
    return superagent.get(
      `https://dog.ceo/api/breed/${result}/images/random`
    );
  })
  ///We consume the promise using the then(). This consumes the resolved values returned above
  //and also returns a promise
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file');
  })
  .catch((err) => {
    console.log(err);
  });

// And again the reason we are able to chain these then(), is to return a promise b4 calling each
// of them as seen above.
//And the beauty of this is for all the codes above we just have one fc handling the error
