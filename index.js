const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const app = express();
app.use(morgan('common'));

app.use(express.static('Public'));

app.use(bodyParser.json());

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/horror-time', {useNewUrlParser: true, useUnifiedTopology:true});

/*app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});*/

//get requests
app.get('/', (req, res) => {
  res.send('Welcome to Horror Time');
});

//get list of data of movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movie) => {
    res.status(201).json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/movies/:title', (req, res) => {
  movieReq = req.params.title;
  Movies.find({Title: movieReq}).then((movie) =>
  {
    res.status(202).json(movie)
  }).catch((error) =>
  {
    console.log(error);
    res.status(500).send("Error: " + error)
  });
});


app.get('/movies/directors/:name', (req, res) => {
  Movies.findOne({"Director.Name": req.params.name}).then((directorName) => 
  {
    res.status(202).json(directorName.Director)
  }).catch((error) =>
  {
    console.log(error);
    res.status(500).send("Error 500: " + error)
  })
});

app.get('/movies/genre/:name', (req, res) => {
  Movies.findOne({"Genre.Name": req.params.name}).then((genreName) => 
  {
    res.status(202).json(genreName.Genre)
  }).catch((error) =>
  {
    console.log(error);
    res.status(500).send("Error 500: " + error)
  })
});

app.post('/users', (req, res) => {
  Users.findOne({Username: req.body.Username})
  .then((user) => {
    if(user) {
      return res.status(400).send(req.body.Username + 'already exists');
    } else {
      Users
        .create({
          Username:req.body.Username,
          Password: req.body.Password, 
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((user) => {res.status(201).json(user)
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
    }
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send('Error: ' + error);
  });
});

app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/users/:Username', (req, res) => {
  Users.findOne({Username: req.params.Username})
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.post('/users/:Username/Movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, 
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

app.delete('/users/:username/movies/:MovieID', (req, res) => {
  let user = req.params.Username;
  let favmovie = req.params.MovieID;

  Users.findOneAndUpdate({Username: user},
    {
      $pull:
      {
        FavoriteMovies: favmovie
      }
    }).then((user) =>
    {
      if (!user)
      {
        res.status(400).send(req.params.Username + ' was not found' );
      }
      {
        res.status(200).send(req.params.MovieID + ' was deleted');
      }
    }).catch((error) =>
    {
      console.log(error);
      res.status(500).send('Error: ' + error)
    })
});

app.delete('/users/:Username', (req, res) => {
 Users.findOneAndRemove({ Username: req.params.Username})
 .then ((user) => {
   if(!user) {
     res.status(400).send(req.params.Username + 'was not found');
   } else {
     res.status(200).send(req.params.Username + 'was deleted.');
   }
 })
 .catch((err) => {
   console.error(err);
   res.status(500).send('Error: ' + err);
 });
});

// app.get('/test-search/:data', (req, res) => {
//   let response = movies.filter(movie => movie.title.toLowerCase().includes(req.params.data.toLowerCase()))
// })

app.listen(8000, () => {
  console.log('App is listening on port 8000');
});
