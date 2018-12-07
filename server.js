var express = require('express');
var axios  = require('axios');
var dotEnv = require('dotenv').config();
var path = require('path');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
  id: process.env.SPOTIFY_ID ,
  secret: process.env.SPOTIFY_SECRET
});


// you can make a request to a database here and retrieve some data
// but for this example, we are using a static object of user information



// route pages
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/movie', function (req, res) {
    var check = req.query.name;
    if (check) {
        var queryUrl = "http://www.omdbapi.com/?t=" + check + "&y=&plot=short&apikey=" + process.env.movie_API;
        axios.get(queryUrl).then(
            function(response) {
              // If the axios was successful...
              // Then log the body from the site!
              var results = response.data
             res.render('movie',{movie: results});
            })
    
    } else {
      res.send('User does not exist...');
    }
  });
  app.get('/spotify', function (req, res) {
    var check = req.query.name;
    if (check) {
      spotify.search({ type: 'track', query: check }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        res.render("spotify",{tracks:data.tracks.items})
      console.log(data.tracks); 
      console.log(data.tracks.items); 
      });
        
    
    } else {
      spotify.search({ type: 'track', query: 'The Sign%20ace%20of%20base' }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
        res.render("spotify",{tracks:data.tracks.items})
      console.log(data.tracks); 
      console.log(data.tracks.items); 
      });
    }
  });

// what port to run server on
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});