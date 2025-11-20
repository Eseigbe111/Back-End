class APIFeatures {
  // Inside the constructor(){}, we will need the "query" and the 'queryString' bcosit was what we used
  // in the tourController b4 moving them here.
  constructor(query, queryString, model) {
    this.query = query;
    this.queryString = queryString;
    // The model below is actually the Tour created from tourModel and i added it bcos i wanted to be able to
    // the pages in a doc or the docs rather
    this.model = model; // so we can use countDocuments()
  }

  //1) BUILD A QUERY.
  filter() {
    // FILTERING: We sent GET "http://127.0.0.1:3000/api/v1/tours?duration=2&difficulty=easy&sort=1&limit=10"
    //  BUILD QUERY
    const queryObj = { ...this.queryString }; //making a shallow copy so we do not tamper with the  req.body

    // Below are the fields we want to exclude from queryObj
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // ADVANCED FILTERING: we sent GET "127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy" in Postman. We do "{ duration: { gte: '5' },
    // difficulty: 'easy' }" to be like {  duration: { {$gte: 5}, difficulty: 'easy' } i.e adding $ to gte, which is easily understood by Mongodb
    // COVERTING queryObj to STRING so we can use regrex on it
    let queryStr = JSON.stringify(queryObj);

    // USING regrex on queryStr to
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(queryObj, JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr)); // We did not await the straight away like this "await Tour.find(queryObj)" we have other mthds
    // to be called on on the query.

    return this; // Where "this is the entire object"
  }

  // SORTING: Remember sort was in the excludedFields so if we want to sort by prices and do GET 127.0.0.1:3000/api/v1/tours?sort=price,ratingsAverage
  // in Postman, nothing will happen.But let's now handle that case
  sort() {
    if (this.queryString.sort) {
      // Getting the sort from the req.query
      const sortBy = this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);

      // sorting the query by sortBy
      this.query = this.query.sort(sortBy);
    } else {
      //This is if no "sort()" on req.query, it should be sorted by the last to be created i.e so the newest ones appear first
      //bcos of the "-"
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // FIELD LIMITING: Limiting fields (also called field selection or projection) is used to tell MongoDB:
  // “Only send me these specific fields — I don’t need the rest.”. We send a GET "127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price"
  limitFields() {
    if (this.queryString.fields) {
      // console.log(req.query.fields);
      const fields = this.queryString.fields.split(',').join(' ');
      // console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // We want to exclude this in the selection
    }

    return this;
  }

  // PAGINATION - is the splitting a large set of data into smaller chunks (pages) so you don’t load everything at once. lets say we have 1000 docs, results per
  // page(which is limit) = 10, so 1000 / 100 = 10pages. So we will have Page 1 → documents 1–100, Page 2 → documents 101–200, Page 3 → documents 201–300 and so on.
  // The SKIP() - When using MongoDB (or Mongoose), there’s a method called .skip() that tells the database how many results to skip before starting to return documents
  // The general formula is: skip = (page - 1) * limit. We used this to test GET "127.0.0.1:3000/api/v1/tours?page=2&limit=3"
  async paginate() {
    // We used async bcos of this part below "await this.model.countDocuments();"
    const page = this.queryString.page * 1 || 1; // to convert the string to number and also we used optional chaining
    // to define a default value of 1 i.e  "|| 1"

    const limit = this.queryString.limit * 1 || 100; // This means If the user provides a limit in the query string (e.g. ?limit=5), use that value,
    // If not, use the default value, which here is 10.
    // console.log(typeof page, limit);

    const skip = (page - 1) * limit; //The number we want to be skipped

    this.query = this.query.skip(skip).limit(limit); //This is what we want to query

    // Optional page validation
    if (this.queryString.page) {
      const numDocs = await this.model.countDocuments();
      if (skip >= numDocs) throw new Error('This page does not exist');
    }

    return this;
  }
}

module.exports = APIFeatures;
