// I am experimenting with smth like the catchAsync fc to understand the one we used in our project

// Importiing the globalErrorHandler
const globalErrorHandler = require("./globalErrorHandler");

// This fc eliminates the trycatch block
module.exports = (fn) => {
  // We are not using Express but complete javascript so i had to create a small Promise to simulate
  // what we had in catchAsync
  return () => {
    Promise.resolve() //
      .then(fn) //
      .catch(globalErrorHandler); //
  };
};
