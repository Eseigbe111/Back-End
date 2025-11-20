// In this course we will talk about the probs that can arise when we use too many call back fcs.

//we will be using an API in this lecture "https://dog.ceo/api/breed/image/random". This Api contains dift dog breeds

//Getting the file sys. module
const fs = require('fs');
// Now inside this callback fc, we want to do that HTTP request that we just talked about b4.
// And there's acctually ways of doing it with native Node.js modules. But it is easier to just
// use an NPM package for that. The one we are going to use is "Super Agent".Later on we're gonna
// use another one. To download this module, we will need to create our package.json file
// We install superagent by doing "npm i superagent"

//We use the superagent by doing the below:
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);
  //1)Doing a get request with the get()
  superagent
    .get(`https://dog.ceo/api/breed/${data}/images/random`)
    .end((err, res) => {
      if (err) return console.log(err.message); // This is if an error occurs
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
    });
});

/// The above s just an e.g to show u how easy it is to end up with callbacks inside callbacks insside callbacks.
// Smt it can even go deeper than this i.e the above. Now all these callbacks, they make our code look a bit messy
// difficult tounderstand and hard to maintain,if we hard so many inside each other.And this is the way we know for now.
// BUT,
// We are going to learn smth called Promises. And that will in the end solve our problem and make our code easier to read
// and to maintain.
