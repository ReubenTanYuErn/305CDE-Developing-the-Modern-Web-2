var request = require('request')

//Search Function
exports.search = function(query, callback) {
  console.log('inside movies.search(' + query + '....)')
  if (typeof query !== 'string' || query.length === 0) {
  	console.log('No word for query')
    callback({code:400, status:'Bad URL', message:'No word for query', data:null})
  }

	const apikey = '788b5abe0b390210cb65c826ce6ae321'
  const url = 'https://api.themoviedb.org/3/search/movie?api_key=' +apikey + '&language=en-US&page=1&include_adult=false' + '&query="' + query
  request.get({url: url}, function(err, res, body) {
    if (err) {
    	console.log('Google Search failed')
      callback({code:500, status:'Error', message:'Google Search failed', data:err})
    }

    const json = JSON.parse(body)	//convert body to object
    const results = json.results
    if (results){
	    const movies = results.map(function(element) {
	      obj = {id: element.id,
								title: element.title,
								release_date: element.release_date,
								status: element.status,
								overview: element.overview,
								poster_path: element.poster_path,
								vote_average: element.vote_average,
								genres: element.genres,
								budget: element.budget,
								videos: element.videos,
								homepage: element.homepage,
								review: element.review
	              }
	    	return obj
	    })

	    console.log(movies.length +' movies found')
	    callback({code:200, status:'Success', message:movies.length+' books found', data:movies})
    }
    else
    	callback({code:200, status:'Success', message:'No movie found', data:''})
  })
}

//Details Function
exports.searchMovieInfo = function(movieid, callback) {
  console.log('inside movies.searchMovieInfo(' + movieid + '....)')
  if (typeof movieid !== 'string' || movieid.length === 0) {
  	console.log('No word for query')
    callback({code:400, status:'Bad URL', message:'No movie id specified', data:null})
  }

	const apikey = '788b5abe0b390210cb65c826ce6ae321'
  const url = 'https://api.themoviedb.org/3/movie/'+movieid+'?api_key=' +apikey + '&append_to_response=videos'

  request.get({url: url}, function(err, res, body) {
    if (err) {
    	console.log('Movie not found')
      callback({code:500, status:'Error', message:'No such Movie', data:err})
    }

			const cinematic = JSON.parse(body)
			if (cinematic != null){
			var movie = {
								id: cinematic.id,
								title: cinematic.title,
								release_date: cinematic.release_date,
								status: cinematic.status,
								overview: cinematic.overview,
								poster_path: cinematic.poster_path,
								vote_average: cinematic.vote_average,
								genres: cinematic.genres,
								budget: cinematic.budget,
								videos: cinematic.videos,
								homepage: cinematic.homepage,
								review: cinematic.review
	              }

	    console.log(movie.title +' found')
	    callback({code:200, status:'Success', message: 'Movie found', data:movie})
    }
    else
    	callback({code:404, status:'Movie not found', message:'Movie not found', data:''})
  })
}


//New Releases Function
exports.nowMovies = function(query, callback) {
  console.log('inside movies.search(' + query + '....)')
  if (typeof query !== 'string' || query.length === 0) {
  	console.log('No word for query')
    callback({code:400, response:{status:'error', message:'No word for query'}})
  }

	const apikey = '788b5abe0b390210cb65c826ce6ae321'
  const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=' +apikey + '&language=en-US&page=1'

  request.get({url: url}, function(err, res, body) {
    if (err) {
    	console.log('Google Search failed')
      callback({code:500, response:{status:'error', message:'Search failed', data:err}})
    }

    const json = JSON.parse(body)	//convert body to object
    const items = json.results
    if (items){
	    const movies = items.map(function(element) {
	     return {
	     	title:element.title,
	     	release_date:element.release_date,
	     	overview:element.overview,
	     	id:element.id,
	     	poster_path:element.poster_path,
	     	vote_average:element.vote_average,
	     	videos: element.videos,
	     	status: element.status,
	     	genres: element.genres,
	     	budget: element.budget,
	     	homepage: element.homepage
	     }
	    })
	    console.log(movies.length +' movies found')
	    callback({code:200, response:{status:'success', message:movies.length+' movies found', data:movies}})
    }
    else
    	callback({code:200, response:{status:'success', message:'No movie found', data:''}})
  })
}

//Top Rated Function
exports.topMovies = function(query, callback) {
  console.log('inside movies.search(' + query + '....)')
  if (typeof query !== 'string' || query.length === 0) {
  	console.log('No word for query')
    callback({code:400, response:{status:'error', message:'No word for query'}})
  }

	const apikey = '788b5abe0b390210cb65c826ce6ae321'
  const url = 'https://api.themoviedb.org/3/movie/top_rated?api_key=' +apikey + '&language=en-US&page=1'

  request.get({url: url}, function(err, res, body) {	//function executed on receiving respond from Web API
    if (err) {
    	console.log('Google Search failed')
      callback({code:500, response:{status:'error', message:'Search failed', data:err}})
    }

    const json = JSON.parse(body)	//convert body to object
    const items = json.results
    if (items){
	    const movies = items.map(function(elements) {
	     return {
	     	title:elements.title,
	     	release_date:elements.release_date,
	     	overview:elements.overview,
	     	id:elements.movie_id,
	     	poster_path:elements.poster_path,
	     	vote_average:elements.vote_average
	     }
	    })
	    console.log(movies.length +' movies found')
	    callback({code:200, response:{status:'success', message:movies.length+' movies found', data:movies}})
    }
    else
    	callback({code:200, response:{status:'success', message:'No movie found', data:''}})
  })
}

