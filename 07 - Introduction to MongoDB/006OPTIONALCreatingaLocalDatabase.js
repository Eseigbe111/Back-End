//doc => document
//db=> database

// No matter if u installed MongoDB on windoes or macOs, we will now ceate our 1st local database, using the Mongo Shell.
// The Mongo shell works the same way on macOs or windows, so it does not matter the platform u're using.

//1) So u can run the mongod.exe on one terminal and open the other to run mongosh.exe to work with.
//2) To clear ur terminal u can use "cls"
//3) So we use the "use" command inside the Mongo Shell, and then the name of the database that we want to create.This command
// is also used to switch to an existing database.

// CREATING A DATABASE
// So we do "use natours-test" in the terminal to create our new database of natours-test

//Now our database is ready to receive data. Now remember that inside a database, we have collection, and then each collectn has
// documents in it. And the data we create in MongoDB is always documents. And so we have to create that doc inside of a collectn,
// so we specify that collectn b4 we insert a document. And it works like this:

// CREATING A COLLECTN IN THE DATABASE
// db.tours.insertOne(), db=> refers to natours-test database we just created, "."=> Is used to specify where the collectn is to be,
// "tours" => Is the name of our collectn.
// Whe we want to to create many collectns we use ".insertMany()"

//Inside the ".insertOne()" we an add a json like object which will later be converted to a "BSON" object which i understood by
// the MongoDB as seen below:
/* 
db.tours.insertOne({name: "The Forest Hiker", price: 297, rating: 4.7})
*/
// So like the above we created the 1st docment in our database
// To check our current database, we do "db.tours.find()"

// So u remember back in the prev lecture where i said MongoDB will automatically create these unique ids, that's what we can see
// when we created the collectn in the database

// Another useful command is "show dbs", which will basically show us all the databases that we have in MongoDB.
// So after typing the "show dbs", let's switch to one of the listed "admin" by doing "use admin".

// we can also do "show collection" to see the collectn we created for our natours-test db(database)
