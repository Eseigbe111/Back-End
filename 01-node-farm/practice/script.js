const fs = require("fs");
const http = require("http");
const url = require("url");

// Fc to replace PLACEHOLDERS
const replaceTemplate = (temp, curProd) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, curProd.productName);
  output = output.replace(/{%IMAGE%}/g, curProd.image);
  output = output.replace(/{%FROM%}/g, curProd.from);
  output = output.replace(/{%NUTRIENTS%}/g, curProd.nutrients);
  output = output.replace(/{%QUANTITY%}/g, curProd.quantity);
  output = output.replace(/{%PRICE%}/g, curProd.price);
  output = output.replace(/{%DESCRIPTION%}/g, curProd.description);
  output = output.replace(/{%ID%}/g, curProd.id);

  return output;
};

// Reading the files
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// console.log(data);
const apiData = JSON.parse(data);
// console.log(apiData);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// console.log(tempOverview, tempCard);

//Creating a server
const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true));

  // const pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });

    // Replacing the products in the tempCard
    const cardHtml = apiData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    // console.log(cardHtml);

    // Replacing the tempOverview with the right placeholder i.e cardHtml
    const mainHtml = tempOverview.replace(/{%CARDS%}/g, cardHtml);
    // console.log(mainHtml);

    res.end(mainHtml);
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });

    const curProd = apiData[query.id];
    // console.log(curProd);

    const mainHtml = replaceTemplate(tempProduct, curProd);
    console.log(mainHtml);

    res.end(mainHtml);
  } else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });

    res.end(data);
  } else {
    res.writeHead(404, { "content-type": "text/html" });

    res.end("<h1>This page can not be found</h1>");
  }
});

//Listening forthe ports
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening from port 8000");
});
