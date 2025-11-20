//CREATING a fc that replaces the various HTML holders with the actual HTML values
module.exports = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

// Now to export the module, there are dift ways of exporting smth from a module and we're gonna talk in depth about all this in another section
// later on. But for now, we will just use "module.exports" in the replaceTemplate.js. In each module we have access to a variable called module
// and on there we can set the export ppt and then wet what we want to export.
