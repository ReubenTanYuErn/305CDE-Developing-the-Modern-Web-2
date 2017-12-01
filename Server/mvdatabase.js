var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
/* the database name is stored in a private variable instead of being 'hard-coded' so it can be replaced using the 'rewire' module. This avoids the need for the unit tests to run against the 'live' database. */
var mvdatabase = 'api'
/* the server connections string includes both the database server IP address and the name of the database. */
const server = 'mongodb://'+process.env.IP+':27017/'+mvdatabase
console.log(server)
/* the mongoose drivers connect to the server and return a connection object. */
mongoose.connect(server)
const db = mongoose.connection
/* END OF MONGOOSE SETUP */


/* all documents in a 'collection' must adhere to a defined 'schema'.
Here we define a new schema that includes a mandatory string and an array of strings. */
const QuerySchema = new mongoose.Schema({
    query: { type: String, required: true },
    count: {type: Number, required: true },
    results: [ {type: String} ]
})

const MovieSchema = new mongoose.Schema({
		id: {  type: String, required: true },
    title: { type: String, required: true },
    status: { type: String, required: true },
    budget: {type: String, required: false } ,
    overview: {type: String, required: false},
    poster_path: {type:String, required: false},
    release_date: { type: String, required: true },
    videos: { type: String, required: true },
    genres: { type: String, required: true },
    homepage: {type: String, required: true },
    vote_average: {type: String, required: true }
})

/* the schema is associated with the 'Query' collection which means it will be
applied to all documents added to the collection. */
const Query = mongoose.model('Query', QuerySchema)
const Movie = mongoose.model('Movie', MovieSchema)
/* END OF DEFINING SCHEMA */


exports.addQuery = (mvdata, callback) => {
  console.log('addQuery()...');
  const newQuery = new Query({ query: mvdata.query, count: mvdata.data.length, results:JSON.stringify(mvdata.data)  });
  newQuery.save( (err, data) => {
    if (err)
      callback('Error: '+err);
    else
      callback('Query results saved');
  })
}

exports.addMovie = (mvData, callback) => {
  console.log('Adding movie data ...');

  var newMovie = new Movie({
  	id: mvData.id,
  	title: mvData.title,
  	original_title: mvData.original_title,
    status: mvData.status,
    budget: mvData.budget,
    overview: mvData.overview,
		poster_path: mvData.poster_path,
		release_date:mvData.release_date,
		videos: mvData.videos,
    genres: mvData.genres,
    homepage: mvData.homepage,
    vote_average: mvData.vote_average
  });

  newMovie.save( (err, data) => {
    if (err)
      callback('Error: '+err);
    else
      callback('Movie info saved');
  })
}

exports.getByQuery = (findkeys, callback) => {
  /* the 'find' property function can take a second 'filter' parameter. */
  Query.findOne({query: findkeys}, (err, data) => {
    if (err)
      callback('error: ' + err)
      /*3 types of No data error from mongoDb
      err = null, results = []
      err = null, results = null
      err = error document, results = null
      */
    else if(data==[] || data==null)
      callback(null)
    else
      callback(data._doc);	//_doc is the actual data saved
  })
}

exports.getByMovieId = (findkeys, callback) => {
  Movie.findOne({id: findkeys}, (err, data) => {
    if (err)
      callback('error: ' + err)
    else if(data==[] || data==null)
      callback(null)
    else
      callback(data._doc)	//_doc is the actual data saved
  })
}

exports.getAll = callback => {
  Query.find( (err, data) => {
    if (err) {
      callback('error: '+err)
    }
    const query = data.map( item => {
      return {id: item._id, name: item.name}
    })
    callback(query)
  })
}

exports.getById = (id, callback) => {
  /* the 'find' property function can take a second 'filter' parameter. */
  Query.find({_id: id}, (err, data) => {
    if (err) {
      callback('error: '+err)
    }
    callback(data)
  })
}

exports.clear = (callback) => {
  /* the 'remove()' function removes any document matching the supplied criteria. */
  Query.remove({}, err => {
    if (err) {
      callback('error: '+err)
    }
    callback('Queries deleted')
  })
}

