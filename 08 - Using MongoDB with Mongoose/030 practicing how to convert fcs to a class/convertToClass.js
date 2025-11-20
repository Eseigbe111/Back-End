class StringQuery {
  constructor(sentence) {
    this.sentence = sentence;
  }

  findWord(word) {
    return this.sentence.includes(word);
  }

  countWord(word) {
    return this.sentence.split(word).length - 1;
  }

  replaceWord(oldWord, newWord) {
    return this.sentence.replaceAll(oldWord, newWord);
  }

  charCount() {
    return this.sentence.split(" ").join("").length;
  }
}

const sq = new StringQuery("JavaScript is fun. I love JavaScript!");
// console.log(sq.findWord("JavaScript"));
// console.log(sq.countWord("JavaScript"));
// console.log(sq.replaceWord("JavaScript", "Python"));
// console.log(sq.charCount());

// Exercise 2
class StringTools {
  constructor(str) {
    this.str = str;
  }

  startsWith(prefix) {
    return this.str.startsWith(prefix);
  }

  endsWith(suffix) {
    return this.str.endsWith(suffix);
  }

  findIndex(word) {
    return this.str.indexOf(word);
  }

  sliceBetween(startIndex, endIndex) {
    return this.str.slice(startIndex, endIndex);
  }
}

const st = new StringTools("Programming is powerful!");
// console.log(st.startsWith("Pro"));
// console.log(st.endsWith("!")); // true
// console.log(st.findIndex("powerful")); // 17
// console.log(st.sliceBetween(0, 11)); // "Programming"

//Exercise 3
const products = [
  { name: "Laptop", price: 1200, rating: 4.5, category: "electronics" },
  { name: "Keyboard", price: 50, rating: 4.1, category: "electronics" },
  { name: "Book", price: 15, rating: 4.9, category: "books" },
  { name: "Phone", price: 800, rating: 4.7, category: "electronics" },
  { name: "Shoes", price: 60, rating: 4.3, category: "fashion" },
];
// How to select using "." or []
const price = products.map((arr, i, el) => {
  // console.log(el[i].price); //OR
  // console.log(el[i]["price"]);
});

class QueryEngine {
  constructor(data) {
    this.data = data;
  }

  filterByCategory(category) {
    this.data = this.data.filter((item) => item.category === category);
    return this;
  }

  sortByField(field) {
    this.data = this.data.slice().sort((a, b) => a[field] - b[field]);
    return this;
  }

  limitFields(fields) {
    const fieldList = fields.split(",");
    this.data = this.data.map((item) => {
      const obj = {}; // It creates a new object for each product, to contain only the fields listed in the fieldList.
      fieldList.forEach((f) => (obj[f] = item[f]));
      return obj;
    });
    return this;
  }

  paginate(page, limit) {
    const start = (page - 1) * limit;
    this.data = this.data.slice(start, start + limit);
    return this;
  }
}

const result = new QueryEngine(products)
  .filterByCategory("electronics")
  .sortByField("price")
  .limitFields("name,price")
  .paginate(1, 1); // This page is more like the array index and how many result we want to see

console.log(result);

/// I was testing the fc
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

/// I was testing the fc
// console.log(sortByField(products, "price"));
// console.log(limitFields(products, "name,price"));
