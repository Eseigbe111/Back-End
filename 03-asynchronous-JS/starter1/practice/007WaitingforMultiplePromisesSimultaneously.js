// Waiting for Multiple Promises Simultaneously

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
    const data = await readFilePro(`${__dirname}/dog.txt`);
    // console.log(`Breed: ${data}`);

    // THIS IS THE LAST PART FOR THIS SECTION
    /// Now to finish this section, let me show u how multiple promises can be run simultaneously

    const resPro1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const resPro2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const resPro3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const res = await Promise.all([
      resPro1,
      resPro2,
      resPro3,
    ]);

    // console.log(res);

    // const url = res.forEach(async (el) => {
    //   console.log(el.body.message);
    //   await writeFilePro('dog-img.txt', el.body.message);
    // });

    // THis is the reason u can not do it, using res.forEach():
    //a) forEach doesn’t await async callbacks — it just fires them all.
    //b)You end up doing multiple writes to the same file (appendFile), which:
    // is slower (I/O overhead for each call)
    // can cause race conditions (two writes at the same time)
    // is harder to manage or debug

    // So the below is the right way: THe map() returns an array we can then await
    const url = res.map((el) => el.body.message);
    console.log(url);

    const urlJoin = url.join('\n');
    console.log(urlJoin);

    await writeFilePro('dog-img.txt1', urlJoin);

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
