/* (0) ####load required modules#### */
var restify = require('restify')
var movies = require('./cinematic.js')
var staticServer = require('serve-static-restify')
var db = require('./mvdatabase.js')

/* (1) ####CONFIGURE THE REST SERVER#### */
/* (1-1) import the required plugins to parse the body and auth header. */
var server = restify.createServer()
server.use(restify.queryParser())		//parse querystring params to req.query
server.use(restify.fullResponse())	//handles disappeared CORS headers
server.use(restify.bodyParser())		//parse POST bodies to req.body
server.use(restify.authorizationParser()) //parse Authroization header to req.authorization
server.pre(staticServer('../Client/', {'index': ['index.html']})) // for serving Angular JS files

/* (1-2) setup port & default error handler */
var port = 8080;
server.listen(port, function (err) {
  if (err) {
      console.error(err);
  } else {
    console.log('App is ready at : ' + port);
  }
})

//Search Service
server.get('/movies', function(req, res) {
	const searchTerm = req.query.q
	console.log('GET /movies?q=' + searchTerm)
  if (typeof searchTerm == 'undefined') {
  	res.send({'status':404, 'message':'no keyword for search'})
  	return
  }
  // this is where you access MongoDb
  db.getByQuery(searchTerm, function(data) {
    if (data != null){  // Array.isArray(data) && data.length) {  //data is array && not []
      var jdata = JSON.parse(data.results);
      console.log('reuse persisted data');
      res.setHeader('content-type', 'application/json');
      res.send(200, {code:200, status:'Success', message:'Persisted data', data:jdata});  //1st arg eqv res.status(200)
      res.end();
    }else{
        movies.search(searchTerm, function(mvData) {
            wrapping(res, mvData.code, mvData, req.headers.origin)
            mvData.query = searchTerm;     //add searchTerm to mvData for addQuery to save searchTerm
            db.addQuery(mvData, dbResult => {
                console.log('MongoDB: '+ dbResult);
        })
      })
    }
  })
})

//Details Service
server.get('/movies/find/:id', function(req, res) {
	const movieid = req.params.id
  console.log('GET /movies?q=' + movieid)
  if (typeof movieid == 'undefined') {
  	res.send({'status':404, 'message':'no movie selected'})
  	return
  }
  // this is where you access MongoDb
  db.getByMovieId(movieid, function(data) {
    if (data != null){  // Array.isArray(data) && data.length) {  //data is array && not []
      var jdata = {}
      //var jdata = JSON.parse(data);
      console.log('use persisted data');
      res.setHeader('content-type', 'application/json');
      jdata.data = data
      jdata.message = data.title + ' found'
      jdata.code = 200
      res.send(200, jdata);		  //1st arg eqv res.status(200)
      res.end();
    }else{
      movies.searchMovieInfo(movieid, function(mvData) {
         wrapping(res, mvData.code, mvData, req.headers.origin)

          mvData.query = movieid;     //add searchTerm to mvData for addQuery to save searchTerm
          db.addMovie(mvData.data, dbResult => {
              console.log('MongoDB: '+ dbResult);
          })
      })
    }
  })
})

//New Releases Service
server.get('/movies/:now_playing', function(req, res) {
  const nowTerm = req.params.now_playing
  if (typeof nowTerm == 'undefined') {
  	res.send({'status':404, 'message':'no keyword for search'})
  	return
  }

   movies.nowMovies(nowTerm, function(data) {
    console.log('From api.themovie.org ...' + JSON.stringify(data))
   // if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
   // }
    //res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    res.setHeader('Content-Type', 'application/json');
    res.send(data.code, data.response);
    console.log(JSON.stringify(data.response))
    res.end();
  })
})

//Top Rated Service
server.get('/movies/:top_rated', function(req, res) {
  const topTerm = req.params.top_rated
  if (typeof topTerm == 'undefined') {
  	res.send({'status':404, 'message':'no keyword for search'})
  	return
  }

   movies.topMovies(topTerm, function(data) {
    console.log('From api.themovie.org ...' + JSON.stringify(data))
   // if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
   // }
    //res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
    res.setHeader('Content-Type', 'application/json');
    res.send(data.code, data.response);
    console.log(JSON.stringify(data.response))
    res.end();
  })
})

//Deletion Service
server.del('/movies/:title', function(req, res) {
  console.log('DELETE /movies/:title');
  db.clear(dbResult => {
      console.log('mongo: '+ dbResult);
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
    	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
      res.setHeader('content-type', 'application/json');
      res.send(202, 'Query cache deleted');  //1st arg eqv res.status(200)
      res.end();
  })
});

function wrapping(res, code, body, origin){
	res.header('Access-Control-Allow-Origin', origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');
  res.setHeader('content-type', 'application/json');
  res.send(code, body);  //1st arg eqv res.status(200)
  res.end();
}





