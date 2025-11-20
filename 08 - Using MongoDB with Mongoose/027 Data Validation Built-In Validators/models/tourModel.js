///
//Importing mongoose
const mongoose = require('mongoose');
const slugify = require('slugify');

// devprs=> developers

//THIS IS FOR THIS LECTURE:
//DATA VALIDATN : BUILT-IN VALIDATORS
// So Mongoose offers us devprs very powerful ways of validating data that's coming into our model. And so in this video,
// u're gonna learn all about data validatn with Mongoose.

// VALIDATN: This is basically checking if the entered values are in the right format for each field in our doc Schema, and
// also that values have actually been entered for all of the required fields.
// Now on the other hand we also have SANITIZATN, which is to ensure that the inputted data is basically clean, so that there
// is no malicious code being injected to our database of into the application itself. So thruthat step i.e "SANITIZATN", we
// remove unwanted character or even code, from the input data. And this is actually a crucial step, like a golden standard
// in back-end devpt i.e to never, ever accept input data coming from a user as it is. So we always need to Sanitize that
// incoming data. Well anyway, i will leave data SANITZATN for the "securities" sectn of the course so that in this lecture
// we can focuse entirely on data VALIDATN

// Now Mongoose already comes with sm  validatn tools out of the box. And so let's now do sm data validatn. The "required"
// we used above is already a data VALIDATOR which is built-in. And "required" is actually available to all the data types.
// "unique" is not technically a validator bcos it will give u error whe a duplicate emerges i.e if we create name duplicate.

// So we will be dealing with our tourSchema in this lecture
// And the below is what i want to show u in this lecture, but there are a bunch of other VALIDATORS.

// creating a very small schema for our tours:
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      required: [true, 'A tour must have a name'], // Passing an error string we want to be displayed whe we are missing this field
      unique: true, // This means we can't have two tour docs with the same name
      trim: true, // This only works for string, which removes all the whitespaces in the beginnig and in the end of the string

      //THIS IS FOR THIS LECTURE: The "maxlength" and "minlength" validators are just for Strings.
      //a) maxlenght:As the name implies, we use this to specify the max length that a string can have. And if its longer than that, its going
      // to produce an error. As we did for the required field, we specifyin an array the "length" we want and then the "error message"
      maxlength: [
        40,
        'A tour name must have less or equal than 40 characters ',
      ],
      //b)minlength: we use this to specify the min length that a string can have.
      minlength: [
        10,
        'A tour name must have more or equal than 10 characters ',
      ],

      //To try these two VALIDATORS we will send a response with the "Create New Tour"in Postman. Remember to remove
      // this part " "secretTour":true ". So this worked well.
      // So let's also try updating a particular tour by changing the name to "TEST". So this also worked well and its
      // actuall bcos in our "updateTour()" handler  in the tourController.js, we set "runValidators: true". If it was
      // set to false, then, our code above will have no effect, and that short name "TEST" will actually be accepted.
    },

    //Ends here

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

      // THIS IS FOR THIS LECTURE
      // Here i want to limit or restrict the difficulty to just 3, Difficult, Medium and Easy.
      // The validator for that is "enum".

      enum: {
        values: ['easy', 'medium', 'difficult'], //Passing an array of the values that are allowed
        message: 'Difficulty is either: easy, medium, difficult', // This is the error message we want when none of the above is inputted
      },

      //We also test this with the "Create New Tour" and experiment around it

      //Ends here
    },

    // I did not give the ratingsAverage and ratingsQuantity the required ppt bcos it is not the user who cretes these tours who will
    // actually specify these values. These will later be calculated from the reviews
    ratingsAverage: {
      type: Number,
      default: 4.5, // So here if we create a new tour doc using this schema and not specifying the rating, it will then automatically
      // be set to 4.5.

      //nos.= numbers

      //THIS IS FOR THIS LECTURE: VALIDATORS FOR NUMBERS
      // We know that a rating must always be btw 1 and 5. And so, very similar to the min and max length, on nos., we simply have min
      // and max.

      //a)min
      min: [1, 'Rating must be above 1.0'], // 1st is rating, 2nd is the  error message

      //b)max: This ma will also work for dates
      max: [5, 'Rating must be below 5.0'],

      // Also we test this by using the "Create New Tour" and vary the ratingsAvarage such that it will give
      // error and also that will give the correct value.

      //Ends here
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

  // console.log(doc);
  next(); // In this case again we only have one post middleware and so we wouldn't really need next(), but
  // it's a best practice to simply always include it.
});

//curr=> current

//2) QUERY MIDDLEWARE:
//a) pre middleware for ".find()"
// tourSchema.pre('find', function (next) {
// this.find({ secretTour: { $ne: true } }); // "ne=> not equal".
// next();
// });

// The below is the right way
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
  // console.log(docs);
  next();
});

// So we learned about Doc and query middleware, and now the last middleware that we are gonna talk about is
// "aggregatn middleware"

//3) AGGREGATN MIDDLEWARE

// So we want the below to happen b the aggregatn is done, so we use he aggregatn hook
tourSchema.pre('aggregate', function (next) {
  // So remember that in Query middleware, the "this" object pts to the query, then in Doc middleware, the "this"
  // object pts to the doc, and so in the aggregatn middleware, "this" is gonna pt to the current aggregatn object.

  console.log(this.pipeline()); // let's see what it looks like. So this gives the array we passed into the aggregate
  // fc b4 (this is located in tourCotroller.js). So in order to filtr out the "Super Screte Tour", all we have to do
  //is to add another match stage right at the beginning of the pipeline array, and that's why we used pre('aggregate).
  // So let's do just that:

  // "unshift" is used to add an element at the beginning of an array in Javascript
  this.pipeline().unshift({
    //adding another stage i.e match
    $match: { secretTour: { $ne: true } },
    // we try it by sending the "Get Tour Stats". we see that the "DIFFICULTY" is now 5, which was 6 b4, So meaning the
    // "Super Secret Tour" has been exempted, and the total is now 12.
  });
  next();
});

// I am not going to talk about "MODEL MIDDLEWARE", which is the 4th,bcos it is not really important.

////////
const Tour = mongoose.model('Tour', tourSchema); // This is a conventn in programming to always use Uppercases for model names and variables.
// I used a capital "Tour" also so we know we are dealing with a model.

//exporting Tour so it can be used in the tourController where we want to create, query, delete and update tours.
module.exports = Tour;

// devprs=> developers

//THIS IS FOR THIS LECTURE:
//DATA VALIDATN : BUILT-IN VALIDATORS
// So Mongoose offers us devprs very powerful ways of validating data that's coming into our model. And so in this video,
// u're gonna learn all about data validatn with Mongoose.

// VALIDATN: This is basically checking if the entered values are in the right format for each field in our doc Schema, and
// also that values have actually been entered for all of the required fields.
// Now on the other hand we also have SANITIZATN, which is to ensure that the inputted data is basically clean, so that there
// is no malicious code being injected to our database of into the application itself. So thruthat step i.e "SANITIZATN", we
// remove unwanted character or even code, from the input data. And this is actually a crucial step, like a golden standard
// in back-end devpt i.e to never, ever accept input data coming from a user as it is. So we always need to Sanitize that
// incoming data. Well anyway, i will leave data SANITZATN for the "securities" sectn of the course so that in this lecture
// we can focuse entirely on data VALIDATN

// Now Mongoose already comes with sm  validatn tools out of the box. And so let's now do sm data validatn. The "required"
// we used above is already a data VALIDATOR which is built-in. And "required" is actually available to all the data types.
// "unique" is not technically a validator bcos it will give u error whe a duplicate emerges i.e if we create name duplicate

//Ends here
