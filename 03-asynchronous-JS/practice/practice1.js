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
    const country1 = (await readFilePro(`${__dirname}/country1.txt`)).trim();
    const country2 = (await readFilePro(`${__dirname}/country2.txt`)).trim();
    const country3 = (await readFilePro(`${__dirname}/country3.txt`)).trim();
    // console.log(country1, country2, country3);

    // Promise.all() is used for urls
    //Awaiting the 3 countries body using Promise.all()
    const data = await Promise.all([
      superagent.get(`https://restcountries.com/v3.1/name/${country1}`),
      superagent.get(`https://restcountries.com/v3.1/name/${country2}`),
      superagent.get(`https://restcountries.com/v3.1/name/${country3}`),
    ]);

    // console.log(data);
    const res = data.map((res) => res.body[0]);
    console.log(res);

    // Getting the flags of countries with borders
    const flagsUrl = res
      .filter((res) => {
        if (res.borders === undefined)
          console.log(`${res.name.common} has no border`);
        return res.borders !== undefined;
      })
      .map((res) => res.flags.png);
    console.log(flagsUrl);

    const flags = flagsUrl.join("\n");
    console.log(flags);

    // // writing to the file
    await writeFilePro("flags1.txt", flags);
    console.log("File written successfully");
  } catch (err) {
    console.log(err);
  }
};

getCountry();
