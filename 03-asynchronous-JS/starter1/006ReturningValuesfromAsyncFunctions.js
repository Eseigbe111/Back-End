//Getting the file sys. module
const fs = require('fs');

// We got the superagent by doing "npm i superagent"
// We use the superagent by doing the below:
const superagent = require('superagent');

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
    // const data = await readFilePro(`${__dirname}/dogtt.txt`); // Simulating error to use the throw error()
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
    throw err;
  }
  return '2:READY 🤨';
};

// USING async/await. I used an IIFE so it will call the fc immediately
(async () => {
  try {
    console.log('1: Will get dog pics!');
    const res = await getDogPic();
    console.log(res);
    console.log('3: Done getting dog pics!');
  } catch (err) {
    console.log(err);
    console.log('ERROR 💥');
  }
})();

////////////////
// This is using the then() to perform the same stuff as the async/await: Temple was the one that did this for good understanding
// getDogPic()
//   .then((res) => {
// console.log('1: Will get dog pics!')
//     console.log(res);
// console.log('3: Done getting dog pics!')
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log('ERROR 💥');
//   });

//// This is forthis lecture:
// In order to understand a bit better what happens in async/await, let's put sm console.log();
// after and b4 calling the asyn fc as seen above.

//HANDLING AN ERROR IN ASYNC/AWAIT FOR RETURN VALUES
//if getDogPic() has a rturn value in it, then we will have to consume the value of the promise
// using async/await or the then(). Now if an error occurs it will still mark the promise as
// successful when it is not actually. So to handle or make this reject the promise, we will need
// to use the throw(err) as seen above. So this error will be caught in the last place we handled
// it. From the above u see, it logged the message twice, one: Of which is coming from the first
// catch block and the 2nd: Of which is from the 2nd catch block outside the fc. This will then
// mark the entire promise as rejected

// WATCH THIS AGIAN IF U NEED TO. ALTHOUGH, ALMOST THE SAME WAS TAUGHT IN JAVASCRIPT. THAT'S WHY
// DID NOT WRITE MUCH.
