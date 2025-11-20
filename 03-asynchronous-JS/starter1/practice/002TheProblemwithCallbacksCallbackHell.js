// The Problem with Callbacks Callback Hell
const fs = require('fs');
const superagent = require('superagent');

// Reading from file:
fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      // This is if there is an error when fetching data
      if (err)
        return console.log(`${err.status}: ${err.message}`);

      //This is if no error
      console.log(res.body.message);

      // Writing this url in res.body.message to a file "dog-img.txt"
      // fs.writeFile(
      //   'dog-img.txt',
      //   res.body.message,
      //   (err) => {
      //     // If an err occurs when writing to thefile
      //     if (err)
      //       return console.log(
      //         `${err.status}: ${err.message}`
      //       );

      //     //This is if no error
      //     console.log('Random dog image saved to file');
      //   }
      // );

      // THe above code will always overide an existing text in the file that it is being save too

      // The below will append each saved url to the file
      fs.appendFile(
        'dog-img.txt',
        res.body.message + '\n',
        (err) => {
          // If an err occurs when writing to thefile
          if (err)
            return console.log(
              `${err.status}: ${err.message}`
            );

          //This is if no error
          console.log('Random dog image saved to file');
        }
      );
    });
});
