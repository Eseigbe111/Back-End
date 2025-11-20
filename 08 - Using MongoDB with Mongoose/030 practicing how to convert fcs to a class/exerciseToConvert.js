// Exercise 1

function findWord(sentence, word) {
  return sentence.includes(word);
}

function countWord(sentence, word) {
  return sentence.split(word).length - 1;
}

function replaceWord(sentence, oldWord, newWord) {
  return sentence.replaceAll(oldWord, newWord);
}

const sq = new StringQuery("JavaScript is fun. I love JavaScript!");

// Expected output
console.log(sq.find("JavaScript")); // true
console.log(sq.count("JavaScript")); // 2
console.log(sq.replace("JavaScript", "Python"));
// Output: "Python is fun. I love Python!"

// Exercise 2
function startsWith(str, prefix) {
  return str.startsWith(prefix);
}

function endsWith(str, suffix) {
  return str.endsWith(suffix);
}

function findIndex(str, word) {
  return str.indexOf(word);
}

function sliceBetween(str, startIndex, endIndex) {
  return str.slice(startIndex, endIndex);
}

const st = new StringTools("Programming is powerful!");

// Expected Usage Example
console.log(st.startsWith("Pro")); // true
console.log(st.endsWith("!")); // true
console.log(st.findIndex("powerful")); // 17
console.log(st.sliceBetween(0, 11)); // "Programming"

// EXERCISE 3
// Your Data
const products = [
  { name: "Laptop", price: 1200, rating: 4.5, category: "electronics" },
  { name: "Keyboard", price: 50, rating: 4.1, category: "electronics" },
  { name: "Book", price: 15, rating: 4.9, category: "books" },
  { name: "Phone", price: 800, rating: 4.7, category: "electronics" },
  { name: "Shoes", price: 60, rating: 4.3, category: "fashion" },
];

// Functions You Must Convert
function filterByCategory(arr, category) {
  return arr.filter((item) => item.category === category);
}

function sortByField(arr, field) {
  return arr.slice().sort((a, b) => a[field] - b[field]);
}

function limitFields(arr, fields) {
  const fieldList = fields.split(",");
  return arr.map((item) => {
    const obj = {};
    fieldList.forEach((f) => (obj[f] = item[f]));
    return obj;
  });
}

function paginate(arr, page, limit) {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
}

/// I was testing the fc
// console.log(sortByField(products, "price"));
console.log(limitFields(products, "name,price"));

// Your Task
// Create a class named QueryEngine that:
// Accepts the products array in the constructor
// Stores it as this.data
// Converts each of the above functions into methods
// Uses method chaining like this:
// const result = new QueryEngine(products)
//   .filter("electronics")
//   .sort("price")
//   .fields("name,price")
//   .paginate(1, 2)
//   .get();

// Expected output
[
  { name: "Keyboard", price: 50 },
  { name: "Phone", price: 800 },
];
