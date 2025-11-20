// This video is the 1st one of creating the CRUD opration. This video is about creating a new doc.

// For each of the videos i will move the initial db into a new one so when i an revising, it will be
// easy for me to know where i stopped and continued from.
// I created a script  called "copy_db.js" in my file here to copy the natours-test to natours-test0
// and used this command to run it  "mongosh --file .\copy_db0.js", and it copied successfully.
// To use this script, we just need to change were we are copying from and to.

/////// So now we continue with Jonas
// We are working in the terminal for now bcos i want u to learn the fundamentals of mongodb without the
//context of any application.
//Last lecture we created a doc using ".insertOne()", but now we will create two using ".insertMany()" as
// seen below:
/* 
db.tours.insertMany([{name: "The Sea Explorer", price: 497, rating: 4.8}, {name: "The Snow Adventurer", price: 997, rating: 4.9, difficulty: "easy"}])
*/
// We do db.tours.find() to see our created collectns
