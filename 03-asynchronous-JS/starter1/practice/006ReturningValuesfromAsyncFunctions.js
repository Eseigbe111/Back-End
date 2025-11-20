// Reurning Values from Async Funtions

const fs = require('fs');

const superagent = require('superagent');

// Promisifying the fs.readFile()
//Creating a readFilePro fc that returns a new Promise
const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      // In case an error occurs that is it is a rejected promise
      if (err) reject('I could not find that file 😪');

      // If success, we resolve the value
      resolve(data);
    });
  });
};

// Promisifying the fs.writeFile()
//Creating a writeFilePro fc that returns a new Promse
const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    // fs.writeFile(file, data  (err) => { // I did not use this soit does not over write what is
    // in the file previously
    fs.appendFile(file, data + '\n', (err) => {
      // if an error occurs when writing file we reject
      if (err) reject('Could not write file 😪');

      // If no err
      resolve('success');
    });
  });
};

// Consuming the promise returned with  AsyncAwait
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txtt`);
    // console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    // console.log(res.body.message);

    await writeFilePro('dog-img.txt', res.body.message);
    console.log('Random dog image saved to file');
  } catch (err) {
    // console.log(err);
    throw err;
  }

  return '2:READY 🤨';
};

// This is how u get returning values from asyncawait fc and also how u catch err
// that we throw i.e throw err,if not no error will show
//  We returned return '2:READY 🤨'; after all operations in the getDogPic()
const x = async () => {
  try {
    const res = await getDogPic();
    console.log(res);
  } catch (err) {
    // We got this err logged here bcos we threw it from the getDogPic() in the catch block
    console.log(err);
    console.log('ERROR 💥');
  }
};
x();
