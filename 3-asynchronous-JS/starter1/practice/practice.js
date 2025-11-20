// Just practicing the below

const fs = require('fs');

const superagent = require('superagent');

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) return reject('I could not find file');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) return reject('Could not save file');
      resolve('success');
    });
  });
};

readFilePro(`${__dirname}/dog.txt`)
  .then((res) => {
    // console.log(`${res}`);

    return superagent.get(
      `https://dog.ceo/api/breed/${res}/images/random`
    );
  })
  .then((res) => {
    console.log(res.body.message);

    writeFilePro('dog-img.txt', res.body.message);
  })
  .then(console.log('Written successfuly'))
  .catch((err) => console.log(err));
