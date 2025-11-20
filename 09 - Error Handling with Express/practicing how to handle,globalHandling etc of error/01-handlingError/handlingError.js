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

//////////////////
//////////////////
// HANDLING ERRORS HERE

class QueryEngine {
  constructor(data) {
    this.data = data;
  }

  filterByCategory(category) {
    //a) Checking if no category,and then throwing an error if true
    if (!category) {
      throw "You must provide a category to filter by";
    }

    const result = this.data.filter((item) => item.category === category);
    //b) Checking if the array is empty
    if (result.length === 0) {
      throw `No products found for this ${category} category`;
    }

    //c)If result is an array, we then Equating this.data to result
    this.data = result;

    return this;
  }

  sortByField(field) {
    //a Checking if field exists
    if (!field) throw "You must provide a field to sort by";

    //b) Checking if field is found in this.data[0] i.e 1st object bcos we assume all data are uniform
    if (!(field in this.data[0])) throw `Field '${field}' does not exist`;

    const result = this.data.slice().sort((a, b) => a[field] - b[field]);

    // //c)If result, we then Equating this.data to result
    this.data = result;

    return this;
  }

  limitFields(fields) {
    //Checking if not fields
    if (!fields) throw "Please provide fields separated by commas";

    const fieldList = fields.split(",");

    const result = this.data.map((el) => {
      // console.log(el);
      const obj = {};
      fieldList.forEach((it) => {
        // console.log(i);
        // checking if "it" exists in product
        if (!(it in el)) {
          throw `Field '${it}' does not exist in product`;
        }
        obj[it] = el[it];
      });
      return obj;
    });

    this.data = result;
    return this;
  }

  paginate(page, limit) {
    if (page < 1 || limit < 1) throw "Page and limit must be positive numbers";
    const start = (page - 1) * limit;
    this.data = this.data.slice(start, start + limit);
    return this;
  }
}

const catchErrors = () => {
  try {
    const result = new QueryEngine(products)
      .filterByCategory("electronics")
      .sortByField("price")
      .limitFields("name,price")
      .paginate(1, 3); // This page is more like the array index and how many result we want to see

    console.log(result);
  } catch (err) {
    console.log("Error:", err);
  }
};
catchErrors();
