// I will use this URL for practiing   https://restcountries.com/v3.1/name/{country}

const fs = require("fs");

const superagent = require("superagent");

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, "utf-8", (err, data) => {
      // 'utf-8', prevents  from getting <Buffer 46 7a 79 30 4f ...> when we log whenwe donot convert to
      // string
      if (err) reject("I could not read file!");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    // fs.writeFile(file, data, (err) => {
    fs.appendFile(file, data + "\n", (err) => {
      // Using appendFile so it does not over write existing url
      if (err) reject("Could not write file!");
      resolve("success");
    });
  });
};

const getCountry = async () => {
  try {
    const country = (await readFilePro(`${__dirname}/country.txt`)).trim();
    console.log(country);

    const res = await superagent.get(
      `https://restcountries.com/v3.1/name/${country}`
    );

    // console.log(res.body[0]);
    // const { borders } = res.body[0];
    // Using optional chaining
    const borders = res.body?.[0]?.borders; // This causes my await and return to have plain
    // test colors
    //

    // console.log(borders);

    if (!borders) return console.log("Country has no border");

    await writeFilePro("flags.txt", res.body[0].flags.png);
    console.log("File written successfully");
  } catch (err) {
    console.log(err);
    throw err;
  }
  return "I am Ready";
};

// getCountry();

const getFlags = async () => {
  try {
    const x = await getCountry();
    console.log(x);
  } catch (err) {
    console.log(err);
  }
};

getFlags();
