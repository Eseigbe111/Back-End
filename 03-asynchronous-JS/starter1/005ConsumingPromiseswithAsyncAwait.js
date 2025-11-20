// Let's now talk of an amazing asynchronous Javascript feature called async/await

//Getting the file sys. module
const fs = require('fs');

// We got the superagent by doing "npm i superagent"
// We use the superagent by doing the below:
const superagent = require('superagent');

// ASYNC/AWAIT
// So promises has made our code a lot better already but we can still do better. So instead of
// consuming promises, with the then() , which still makes us use all these callback fcs, we can
// use smth called async/await.That is a new feature introduced to Javascript in ES8, which will
// make our lives a lot easier.
// So usually when we write code, we're gonna be consuming promises all the time, but uaually not
// producing them so much. And so asyn/await makes that a lot easier to do. Now in order to use
// async/await, we need to create a so-called async fc

// Error Handling
// To handle error in async/await, we use the try-catch() i.e try{}catch(){} as seen belowin the code

// Promisifying the fs.readFile()
//Creating a readFilePro fc that returns a new Promse
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

// This code below will do its fc without ever blocking the event loop.
// And also inside an async fc, e can have so many await fcs
const getDogPic = async () => {
  try {
    //1) Reading content of file
    // With the async/await, we do not need the then()
    const data = await readFilePro(`${__dirname}/dog.txt`); // The "await" will basically stop the code
    // from running until the Promise is resolved. Now if the promise is fulfilled(i.e successful), then
    // the value of the await expression is the resolved value of the promise, which is finally assigned
    // to the data varaible.
    console.log(`Breed: ${data}`);

    //2) Getting the dog image from the API
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    console.log(res.body.message);

    //3) Writing content into file
    await writeFilePro('dog-img.txt', res.body.message);
    console.log('Random dog image saved to file');
  } catch (err) {
    console.log(err);
  }
};
getDogPic();

// TO COMPARE IT WITH THE ABOVE AYNC/AWAIT
// // Consuming the promise returned with then()
// readFilePro(`${__dirname}/dog.txt`)
//   .then((result) => {
//     console.log(`Breed: ${result}`);
//     //Doing a get request with the get() and returning it as a promise
//     return superagent.get(
//       `https://dog.ceo/api/breed/${result}/images/random`
//     );
//   })
//   ///We consume the promise using the then(). This consumes the resolved values returned above
//   //and also returns a promise
//   .then((res) => {
//     console.log(res.body.message);
//     return writeFilePro('dog-img.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Random dog image saved to file');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
