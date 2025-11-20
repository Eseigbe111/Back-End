// Run this command "mongosh --file .\copy_db3.js" to copy all of natours-test2 to natours-test3. U do that b4 running mongosh.exe
// So for this lecture, we will work with this file "natours-test3"

//In this lecture, we will learn how to delete doc in MongoDB.
// So just like b4, we have "deleteOne()" to delete one single doc, and we have "deleteMany()", to delete multiple docs at the same
// time. Just like b4, "deleteOne()" will only work for the 1st doc matching ur query. And "deleteMany()", will of course work for
// all the docs matching ur query.
//1) For e.g I want to delete all the tours that have a rating < 4.8. So we do "db.tours.deleteMany({ rating: {$lt: 4.8}})"
// 2) To delete all the docs in the collectn, u would do "db.tours.deleteMany({})". This is passing the empty object i.e {}, bcos
// the empty object is basically a conditn that all of the docs always match. Doing the the code will delete all of the docs.
