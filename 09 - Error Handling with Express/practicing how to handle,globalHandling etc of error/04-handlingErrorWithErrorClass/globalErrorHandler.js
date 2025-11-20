// This part sends res.status(404).json({...}) inour Natours project
module.exports = (err) => {
  console.log("----- GLOBAL ERROR HANDLER -----");
  console.log("Status:", err.status || "error");
  console.log("Message:", err.message || err);
  console.log("--------------------------------");
};
