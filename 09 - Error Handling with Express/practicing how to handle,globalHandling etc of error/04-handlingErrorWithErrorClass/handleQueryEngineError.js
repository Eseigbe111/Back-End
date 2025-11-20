const QueryEngine = require("./queryEngine");
const globalErrorHandler = require("./globalErrorHandler");
const catchAsync = require("./catchAsync");

//Exercise 3
const products = [
  { name: "Laptop", price: 1200, rating: 4.5, category: "electronics" },
  { name: "Keyboard", price: 50, rating: 4.1, category: "electronics" },
  { name: "Book", price: 15, rating: 4.9, category: "books" },
  { name: "Phone", price: 800, rating: 4.7, category: "electronics" },
  { name: "Shoes", price: 60, rating: 4.3, category: "fashion" },
];

const getResults = catchAsync(() => {
  const result = new QueryEngine(products)
    .filterByCategory("electronics")
    .sortByField("pricee")
    .limitFields("name,price")
    .paginate(1, 3); // This page is more like the array index and how many result we want to see

  console.log(result);
});
getResults();
