// Building Promises
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
    fs.writeFile(file, data, (err) => {
      // if an error occurs when writing file we reject
      if (err) reject('Could not write file 😪');

      // If no err
      resolve('success');
    });
  });
};

// Consuming the promise returned with then()
readFilePro(`${__dirname}/dog.txt`)
  .then((res) => {
    console.log(`Breed: ${res}`);

    //Getting the dog type url
    return superagent.get(
      `https://dog.ceo/api/breed/${res}/images/random`
    );
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('.dog-img.txt', res.body.message);
  })
  .then(() => console.log('Random dog image saved to file'))
  .catch((err) => console.log(err));
