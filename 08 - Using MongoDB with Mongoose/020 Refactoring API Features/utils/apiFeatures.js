class APIFeatures {
  // The constructor fc is the fc thst gets automatically called as soon as we create a new object
  //  out of this class.
  // This constructor fc will only take two arguments : query and queryString coming from the route.
  // And that is what we usually get access to in "req.query". Now, Again, i'm passing the query into
  // the contructor bcos i do not want to query inside the class bcs that would then bounce this class
  // to the tour resource, but again i want this to be as reusable as possible
  //
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  //1) BUILD A QUERY.
  // So as i said, i will create one mthd for each feature as seen below
  filter() {
    //A) FILTERING
    //create a shallow copy of req.query object as seen below:
    const queryObj = { ...this.queryString }; // creating a new object using desrtucting
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    //Next we will need to basically remove these fields i.e excludedFields from our query object.
    excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(req.query, queryObj);

    //B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //"g", makes it to replace all. As at wheni am dooing this course we can use replaceAll().
    // console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));

    return this; // Where "this is the entire object"
  }

  sort() {
    //C) SORTING:
    if (this.queryString.sort) {
      // Mongoose requests a string with sort name separated by spaces
      const sortBy = this.queryString.sort.split(',').join(' ');
      // This gives them space so we can use their values
      this.query = this.query.sort(sortBy);
    } else {
      // query = query.sort('-createdAt');//JONAS used this for the sorting but it did not work for me when i used it for Pagination below.
      // So chatgpt told me it was better to use  query = query.sort('_id'); rather than query = query.sort('-createdAt');
      this.query = this.query.sort('_id');
    }

    return this;
  }

  limitFields() {
    //D) FIELD LIMITING:
    // So the implementation will actually be similar with what we did to sorting
    if (this.queryString.fields) {
      // Mongoose requests a string with the field name separated by spaces just like above
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); // Here it expects string like "name duration price etc". And this called projecting
    } else {
      // Just like b4, a default if the user does not specify the fields
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    //E) MAKING BETTER PAGINATN
    //Getting the page and limit from the query string
    const page = this.queryString.page * 1 || 1; // to convert the string to number and also we used optional chaining
    // to define a default valueof 1 i.e  "|| 1"
    const limit = this.queryString.limit * 1 || 100; // the 100 results is the default as we have 100 results per page.

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit); // So we will send this response "127.0.0.1:3000/api/v1/tours?page=1&limit=3"
    // since we have limited results. we try this "127.0.0.1:3000/api/v1/tours?page=2&limit=3"

    /// We removed the code that was initially here bcos, if u think about it, requesting the next page, which has 0 result, is
    // not really an error. The fact that there are no results is enough for the user to realize that, basically, the page that
    // was requested doesn't contain any data. So we do not really need an error in this situation.
    return this;
  }
}

module.exports = APIFeatures;
