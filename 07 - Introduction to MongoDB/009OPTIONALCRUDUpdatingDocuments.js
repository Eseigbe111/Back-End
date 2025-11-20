// Run this command "mongosh --file .\copy_db2.js" to copy all of natours-test1 to natours-test2. U do that b4 running mongosh.exe
// So for this lecture, we will work with this file "natours-test2"

// So in this lecture, we will learn how to update docs with MongoDB.
//1) To update just one doc, we do "db.tours.updateOne({name: "The Snow Adventurer"}, { $set: {price: 597} })". The 1st object is the one i want
// to update, while the 2nd object is what I want to actually update. After setting the set operator i.e "$set", we then put the ppt we want to
// update in a object i.e "price: 597". Now if this query "db.tours.updateOne({name: "The Snow Adventurer"}, { $set: {price: 597} })" would have
// selected multiple docs, then only the 1st one would have been updated,bcos we were using "updateOne". And so if we already know b4 hand that
// our query is going tomatch multiple docs, then we should use "updateMany()".

//2) We can also create a new ppts and set them to new values.
// Eg I want to find "premium tours" and give them a premium field set to true. So what are our premium tours? So the premium tours should have
// a price > 500 and a rating >= 4.8. So we can do this "db.tours.find({ price: {$gt: 500}, rating: {$gte: 4.8} })". This will give us the premium
// tour. The we want to do "db.tours.updateMany({ price: {$gt: 500}, rating: {$gte: 4.8}, { $set: {premium: true}})". What this code mean is that
// we want to set a new attribute "premium: true" in the docs that have this criteria "{ price: {$gt: 500}, rating: {$gte: 4.8}". The result is
// adding the premium ppt set to true into the docs having the filter or criteria above.

//3) We can also completely replace the content of a doc, and for this we do ".replaceOne()" or ".replaceMany()".So this works exactly as the
// updateOne() or updateMany().
