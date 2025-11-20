//doc
// Run this command in the terminal b4 running "mongosh --file .\copy_db1.js" to copy all of natours-test0 to natours-test1. U do that b4 running mongosh.exe
// So for this lecture, we will work with this file "natours-test1"

// Querying for data in a database is one of the most important operations that we have in databases. And so let's now take a look at a couple of query
// opeartors in MongoDB, starting with sm simple ones and then moving on to sm complex queries.

//QUERYING OR SEARCHING FOR DOCS

//A)The Easiest Way to seacrh for docs
//1) To for all the doc in a certain collectn we use the ".find()" i.e db.tours.find(). This gives us the total docs in a certin collectn without any
// searching criteria
//2) To query for a just one tour, whose name we know, we do "db.tours.find({name: "The Forest Hiker"})". We will get the tour object having that name.
//3) We could use this mthd for any ppt we are searching for. For e.g lets do "db.tours.find({difficulty: "easy"})". So we get all the tours where the
// the difficulty is easy.

//B)Usig special query operators
//1) Let's say we want to search for tours that have price below 500, we will do "db.tours.find({price: {$lte : 500} })". $=>Tell MongoDB that we are
// dealing with an operator, lte=> stands for less than and equal to.

//2) Let's search for 2 search criteria at a time using (AND)  i.e where the two conditions are true
// I want to search for docs that have price <= 500, and the rating >= 4.8. So we can do that like
// this: "db.tours.find({ price: {$lt: 500}, rating: {$gte: 4.8} })" lt=> less than, gte=> greater than and equal to

//3) Let's search for 2 search criteria at a time using (OR) i.e where only one is true only.
// To do that we do: "db.tours.find({ $or: [ {price: {$lt: 500}}, {rating: {$gte: 4.8}} ] })", the array will contain the conditons we are looking for.
// This is another e.g  "db.tours.find({ $or: [ {price: {$gt: 500}}, {rating: {$gte: 4.8}} ] })"

//4) One last thing i want u to know also is that besides this filter object i.e the curly brackets that contains the conditns i.e ".find({})", we can
// also pass in an object for "projectn". "Projectn" means we simply want to select sm of the fields in the output. This is what i mean below:
/* 
 db.tours.find({ $or: [ {price: {$gt: 500}}, {rating: {$gte: 4.8}} ] }, {name: 1})

 In the above i specified another filter argument which is the {name: 1}. what this "{name: 1}" means that we only need the names of the docs. This will 
 in turn list the objects with only the "name ppt"
*/
