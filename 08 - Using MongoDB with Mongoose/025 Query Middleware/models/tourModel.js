///
//Importing mongoose
const mongoose = require('mongoose');
const slugify = require('slugify');

// creating a very small schema for our tours:
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      required: [true, 'A tour must have a name'], // Passing an error string we want to be displayed whe we are missing this field
      unique: true, // This means we can't have two tour docs with the same name
      trim: true, // This only works for string, which removes all the whitespaces in the beginnig and in the end of the string
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'Atour mush have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },

    // I did not give the ratingsAverage and ratingsQuantity the required ppt bcos it is not the user who cretes these tours who will
    // actually specify these values. These will later be calculated from the reviews
    ratingsAverage: {
      type: Number,
      default: 4.5, // So here if we create a new tour doc using this schema and not specifying the rating, it will then automatically
      // be set to 4.5.
    },

    ratingsQuantity: {
      type: Number,
      default: 0, // At the beginning there won't be any rating when the tour is new
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'], // Passing an error string we want to be displayed whe we are missing this field
    },

    priceDiscount: Number,

    summary: {
      type: String,
      trim: true, // This only works for string, which removes all the whitespaces in the beginnig and in the end of the string
      required: [true, 'A tour must have a description'],
    },

    description: {
      type: String,
      trim: true,
    },

    //Image cover is the image u see on the overview page
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    // we want the images to be an array of strings so we can do [String]
    images: [String], // So here it is a string and also an array

    // This a time added automatically as a user creates a tour
    createdAt: {
      type: Date,
      default: Date.now(), // This will give us a timestamp in millisecs. In mongo,
      // this is converted to the real date so that it wil more sense
      select: false, // Making the createdAt not to be seen by the user.
    },

    startDates: [Date], //Also an array of dates a tour starts. Mongo does not automatically
    // convert this.

    secretTour: {
      type: Boolean,
      default: false, // We set this to false bcos we do not want it to show
    },
  },
 
  {
    // The below means each time the data is outputed as JSON, we want virtuals to be true i.e to be
    // part of the output
    toJSON: { virtuals: true },
    // The below is when the data is outputed as an object
    toObject: { virtuals: true },
  },
 
);

//1)Defining the virtual ppts on the tourSchema
//durationWeeks is the name of the virtual ppt
tourSchema.virtual('durationWeeks').get(function () {
  // I used a regular fc bcos an arrow fc does not have its own this keyword
  ////
  // this is how we calc the duratn in weeks
  return this.duration / 7; // The duratn is in days. 7 is bcos there are 7days in a week.
  //"this" is going to pt to the current doc
  ///
}); // we call the get(), bcos this virtuall ppts will always be created each time that we
// get sm data out of the database. And the get() is called a getter

//NB One thing to keep in mind is that u cannot use this virtual ppt 'durationWeeks' in a query bcos they are technically not part of the
// database. So we cannot say, for e.g "Tour.find({'durationWeeks: 1})".

////
//1) DOC MIDDLEWARE: This is a middleware that can act on the currently processed doc. This middleware runs b4 an actual event. It actually runs b4
// the ".save()" and ".create()", but not on the query mthds in Mongoose like ".insertMany()", "findByIdAndUpdate", ".updateOne()" etc.
// Just as the virtual ppts, we define a middleware on the schema as sen below:

//a) .pre : This middleware is what we call a "pre save hook". This has access to the next()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  // "this.name" is what we want to change while "{ lower: true }" is what we want to do.
  // Just like in Express, in Mongoose middleware, we also call the next() middleware.
  next(); // This calls the next middleware in the stack. If not called i.e the next(),
  // the fc will not be executed
});

tourSchema.pre('save', function (next) {
  console.log('Will save document....');
  next();
});

//b) .post :  This middleware is what we call a "post save hook"This has access to the next(), and also to
// the doc that was was just saved to the database.
// ".post" are executed after all the "pre" middleware fcs have completed
tourSchema.post('save', function (doc, next) {
  //Inside here wed do no longer have the "this" keyword but we basically have the finished doc in here i.e doc.

  console.log(doc);
  next(); // In this case again we only have one post middleware and so we wouldn't really need next(), but
  // it's a best practice to simply always include it.
});

//curr=> current

// THIS IS FOR THIS LECTURE:
// In this video, we're gonna talk about the 2nd type of Mongoose middleware, which is the query MIDDLEWARE
//2) QUERY MIDDLEWARE: As the name says, query middleware allows us to run fcs b4 or after a certain query
// is executed. And lets now add a "pre find" hook or middleware, that is gonna run b4 any find query is
//executed.
//As u can see it is just like the pre('save') middleware.The only diff here is really the "find" hook,
// which will make this QUERY MIDDLEWARE and not DOC MIDDLEWARE. And so the big diff here is that the "this"
// keyword will now pt at the curr query and not at the curr doc, bcos we are not really processing any docs,
// but we will be processing a query

//a) pre middleware for ".find()"
// tourSchema.pre('find', function (next) {
// For this e.g let's suppose that we can have secrete tours in our database, like for tours that are only
// offered internally, or for a very small, like, VIP grp of people,and that the public shouldn't knw about
// Now since these tours are secret,we do not want the secret tours to ever appear in the result outputs.
// And so what we are gonna do is to create a secret tour field and then query only for tours that are not
// secret. So we start by adding "secret tour field" in our tourSchema, and let's add it right at the end
// of our tourSchemaafter the "startDates" like this:
/* 
  secretTour: {
  type: Boolean,
  default: false// We set this to false bcos we do not want it to show in our data
  } 
  
  */
// To test it, we will create name "Super Screte Tour" and then send a request in Postman and add this field
// "secretTour":true
// console.log(this);

// So keep in mind that "this" is now a query object, so we can chain all of the mthds that we have for queries.
// this.find({ secretTour: { $ne: true } }); // "ne=> not equal". Here we are selecting all the docs that secret tour is not true.
// After this, we check the list of all tours "Get All Tours", and we will see that secret tour is no longer in
// list bcos of our query.
// next();
//});

// So let me show u one issue we may encounter in this middleware. Right now this middleware is running for ".find()"
// and not for ".findOne()". Now our "Get Tour" in postman is for ".findOne()",now if we copy the "_id" of the
// "Super Secret Tour" and place it in our "Get Tour" route and send a request, we will still find the "Super Secret Tour"
// that we exempted, which means the filter i.e the code we wrote (middleware) is not working, and that is bcos
// the handler fc for "get Tour" route is using ".findById()", which behind the scenes is also dift from the ".findOne()",
// and so it's dift from ".find()". So we need to specify the same middleware for ".findOne()". Now there are
// two ways to do this, one of which we can go ahead and copy the above code and then use the ".findOne()" as
// seen:
// tourSchema.pre('findOne', function (next) {
// this.find({ secretTour: { $ne: true } }); // "ne=> not equal".
// next();
// });
// But the above is not really good. And so instead, we're gonna use a regular expression for that as below:
tourSchema.pre(/^find/, function (next) {
  // So "/^find/" means that the middleware should be executed for not only "find()", but for all the commands that
  // start with the name "find()". this "/^find/" actually means all the strings that starts with "find()"
  this.find({ secretTour: { $ne: true } }); // "ne=> not equal".

  // Setting a clock to see how long ittakes to execute the current query
  this.start = Date.now();

  next();
});
// After the above, when we send "Get Tour" this request with the id "Super Secret Tour", we will get no tour.
// which is now good

//b) post middleware for ".find()": Here we get access to all docs returned from a query. This middleware as we
// runs after the query has been executed
tourSchema.post(/^find/, function (docs, next) {
  // So "/^find/" means that the middleware should be executed for not only "find()", but for all the commands that
  // start with the name "find()". this "/^find/" actually means all the strings that starts with "find()"

  // To get the time this query took tobe executed, we subtract the start time current time i.e "this.start
  console.log(`Query took ${Date.now() - this.start} milliseconds`); // This will be seen on the vsc terminal
  // after the response is sent.
  console.log(docs);
  next();
});

// Ends here

////////
const Tour = mongoose.model('Tour', tourSchema); // This is a conventn in programming to always use Uppercases for model names and variables.
// I used a capital "Tour" also so we know we are dealing with a model.

//exporting Tour so it can be used in the tourController where we want to create, query, delete and update tours.
module.exports = Tour;
