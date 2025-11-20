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
    //////

    // THIS IS FOR THIS LECTURE:
    //2) Getting the dog image from the API
    /// Now to finish this section, let me show u how multiple promises can be run simultaneously. Let's say we want
    // to actually get 3 random dog images and not just one. So simply awaiting the 3 API calls, one after the other.
    // This will just actually add unnecessary waiting time, when we could just run all these promises at the same time.
    //  So let me show u how we can do that as seen below.
    //a) we can rather do the below

    // Saving the promise in a variable b4 awaiting it
    const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    ///b) creating a new variable that will await all above using Promise.all()
    // and pass an arry of promises into it
    const all = await Promise.all([
      res1Pro,
      res2Pro,
      res3Pro,
    ]);
    console.log(all);

    //c)From the all, we will create a new array that only contains "res.body.message"
    // bcos that is what we are interested in.:

    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    //d) Then we save them to our file dog-img.txt in a string format by using the
    // join('\n') to put each on a new line:
    await writeFilePro('dog-img.txt', imgs.join('\n'));

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

///
/// This for this lecture
/// Now to finish this section, let me show u how multiple promises can be run simultaneously
// Let's say we want to actually get 3 random dog images and not just one. We could do smth likethe below"
/* 
const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

*/
// So simply awaiting the 3 API calls, one after the other. This will just actually add unnecessary waiting time
//when we could just run all these promises at the same time. So let me show u how we can do that as seen below.
//1) we can rather do the below

/* 
const res1Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3Pro = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

///2) creating a new variable that will await all above using Promise.all() and pass an arry of promises into it
const all = await Promise.all([res1Pro,res2Pro,res3Pro])
 
//3)From the all, we will create a new array that only contains "res.body.message" bcos that is what we are interested
in.:

const imgs =all.map(el=>el.body.message)

//4) Then we save them to our file dog-img.txt in a string format by using the join('\n') to put each on a new line:

 await writeFilePro('dog-img.txt', imgs.join('\n'));


*/
