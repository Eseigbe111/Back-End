// const products = [
//   { name: "Laptop", price: 1200, rating: 4.5, category: "electronics" },
//   { name: "Keyboard", price: 50, rating: 4.1, category: "electronics" },
//   { name: "Book", price: 15, rating: 4.9, category: "books" },
//   { name: "Phone", price: 800, rating: 4.7, category: "electronics" },
//   { name: "Shoes", price: 60, rating: 4.3, category: "fashion" },
// ];
// // How to select using "." or []
// const price = products.map((arr, i, el) => {
//   // console.log(el[i].price); //OR
//   // console.log(el[i]["price"]);
// });

//Exercise 3
//////////////////
//////////////////
// HANDLING ERRORS HERE

class QueryEngine {
  constructor(data) {
    this.data = data;
  }

  filterByCategory(category) {
    // a) Checking if no category, then throwing an error
    if (!category) {
      throw new Error("You must provide a category to filter by");
    }

    const result = this.data.filter((item) => item.category === category);

    // b) Checking if the array is empty
    if (result.length === 0) {
      throw new Error(`No products found for the '${category}' category`);
    }

    // c) If result is an array, we then equate this.data to result
    this.data = result;

    return this;
  }

  sortByField(field) {
    // a) Checking if field exists
    if (!field) throw new Error("You must provide a field to sort by");

    // b) Checking if field is found in this.data[0] (assuming all objects are uniform)
    if (!(field in this.data[0]))
      throw new Error(`Field '${field}' does not exist`);

    const result = this.data.slice().sort((a, b) => a[field] - b[field]);

    // c) Assign the sorted result back
    this.data = result;

    return this;
  }

  limitFields(fields) {
    // Checking if fields is provided
    if (!fields) throw new Error("Please provide fields separated by commas");

    const fieldList = fields.split(",");

    const result = this.data.map((el) => {
      const obj = {};
      fieldList.forEach((it) => {
        // Checking if the field exists in each object
        if (!(it in el)) {
          throw new Error(`Field '${it}' does not exist in product`);
        }
        obj[it] = el[it];
      });
      return obj;
    });

    this.data = result;
    return this;
  }

  paginate(page, limit) {
    if (page < 1 || limit < 1)
      throw new Error("Page and limit must be positive numbers");
    const start = (page - 1) * limit;
    this.data = this.data.slice(start, start + limit);
    return this;
  }
}

module.exports = QueryEngine;
