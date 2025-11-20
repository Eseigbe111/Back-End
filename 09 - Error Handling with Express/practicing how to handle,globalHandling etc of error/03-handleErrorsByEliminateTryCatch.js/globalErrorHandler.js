module.exports = function globalErrorHandler(err) {
  console.log("----- GLOBAL ERROR HANDLER -----");
  console.log("Status:", err.status || "error");
  console.log("Message:", err.message || err);
  console.log("--------------------------------");
};
