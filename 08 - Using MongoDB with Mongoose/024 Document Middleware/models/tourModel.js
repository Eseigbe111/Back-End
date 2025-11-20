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

    // THIS IS FOR THIS LECTURE
    slug: String,
    // Ends here

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

//db=> database

/// THIS IS FOR THIS LECTURE
// Just like Express, Mongoose also has the concept of MIDLEWARE. And so let's now learn about the 1st type of middleware, which is doc middleware.
// Now, just like with Express, we can use Mongoose middleware to make smth happen btw two events. For e.g,each time a new doc is saved to the db,
// we can run a fc btw the save command that is issued and the actual saving of the doc, or also after the actual saving. And that's the reason why
// Mongoose middleware is also called "pre" and "post" hooks. So again bcos we can define fcs to run b4 and after a certain event, like saving a doc
// to the database. So middleware is an absolutely fundamental concept in Mongoose so just like in Express. And there are tons of possibilites like
// that, and use cases for middleware, and we're gonna be using middleware all the the time in this project.
// So there are 4 types of middleware in Mongoose: doc, query, aggregate, and model middleware.

//1) DOC MIDDLEWARE: This is a middleware that can act on the currently processed doc. This middleware runs b4 an actual event. It actually runs b4
// the ".save()" and ".create()", but not on the query mthds in Mongoose like ".insertMany()", "findByIdAndUpdate", ".updateOne()" etc.
// Just as the virtual ppts, we define a middleware on the schema as sen below:

//a) .pre : This middleware is what we call a "pre save hook". This has access to the next()
tourSchema.pre('save', function (next) {
  //"pre" middleware is gonna run b4 an actual event. In our case is "save" event
  // console.log(this); //In a "save" MIDDLEWARE,the "this" keyword is gonna pt to the currently processed doc.
  // And that's the reason it is called "doc middleware". This bcos in the fc we are now, we have access to
  // the doc that is being processed i.e in our case the doc that is being saved.

  // To test this fc, we will need to create a new tour using our API i.e the Postman app, in order to trigger
  // the middleware above (i.e "pre"). So the data i used in Postman was a concise one that had only the ppts
  // required by our schema.
  // After sending the "create Tour" response, going to the Vsc termminal we can see the log of "this" what our
  // doc looks like b4 saving into the database. So at this pt of time, we can act on the data b4 it is then saved
  // to the database and that's exactly what we are gonna do now.

  // So what i will do now is to create a slug for this doc. So remember how in the 1st sectn, we created
  // a slug for each of the products that we had in the store. And so a slug isbasically just a string that
  // we an put in the URL, usually based on sm string like the name. So in this case, we're gonna create a
  // slug based on the tour's name. So remember how for that we used the slugify package. So let's go ahead
  // to install that by doing "npm i slugify". After that, we can require it at the top of this tourModel.
  // we can then use the slugify this way:
  this.slug = slugify(this.name, { lower: true }); // This is defining ne ppt called slug in the object.
  // "this.name" is what we want to change while "{ lower: true }" is what we want to do.
  // Just like in Express, in Mongoose middleware, we also call the next() middleware.
  next(); // This calls the next middleware in the stack. If not called i.e the next(),
  // the fc will not be executed

  // After that create a field in out tourSchema for our slug so that what the change we did can take effect
  // in our database i.e add this to our tourSchema "slug: String", just after the name field.
  // Then we can then send a response again. We will change  the name to "Test tour 2" so that it will not give
  // us error, as we already said in our tourSchema above that the "name" should be unique.
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

//NB that u can have multiple "pre" or "post" middleware for the same "hook". And hook is what we call the "save"
// event. So sm call it MIDDLEWARE or HOOK.
// After this lecture u can delete all the tours created which we used for ths lecture
//Ends Here

////////
const Tour = mongoose.model('Tour', tourSchema); // This is a conventn in programming to always use Uppercases for model names and variables.
// I used a capital "Tour" also so we know we are dealing with a model.

//exporting Tour so it can be used in the tourController where we want to create, query, delete and update tours.
module.exports = Tour;
