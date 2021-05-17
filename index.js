require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models.js');
const app = express();
const cors = require('cors');
const config = require('./config');
const { check, validationResult } = require('express-validator');
app.use(morgan('common'));

app.use(express.static('Public'));

let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234', 'https://itshorrortime.herokuapp.com/login', 'http://localhost:5000'];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));
app.use(bodyParser.json());


const Movies = Models.Movie;
const Users = Models.User;
const passport = require('passport');
require('./passport');
mongoose.connect(config.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect('mongodb://localhost:27017/horror-time', {useNewUrlParser: true, useUnifiedTopology:true});

let auth = require('./auth')(app);


//get requests
app.get('/', (req, res) => {
  res.send('Welcome to Horror Time');
});

//get list of data of movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//gets a movie by title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  movieReq = req.params.title;
  Movies.find({ Title: movieReq }).then((movie) => {
    res.status(202).json(movie)
  }).catch((error) => {
    console.log(error);
    res.status(500).send("Error: " + error)
  });
});

//gets a movie by directors name
app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.name }).then((directorName) => {
    res.status(202).json(directorName.Director)
  }).catch((error) => {
    console.log(error);
    res.status(500).send("Error 500: " + error)
  })
});

//gets movies by genre
app.get('/movies/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.name }).then((genreName) => {
    res.status(202).json(genreName.Genre)
  }).catch((error) => {
    console.log(error);
    res.status(500).send("Error 500: " + error)
  })
});

//adds new user
app.post('/users',
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //encrypts password
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => {
              res.status(201).json(user)
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

//shows list of all users
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

//finds user by name
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//updates user
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
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

//adds fav movie by id
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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

//deletes movie from list - think about using put instead
app.delete('/users/:username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  let user = req.params.username;
  let favmovie = req.params.MovieID;
  Users.findOneAndUpdate({ Username: user },
    {
      $pull:
      {
        FavoriteMovies: favmovie
      }
    }).then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      }
      {
        res.status(200).send(req.params.MovieID + ' was deleted');
      }
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Error: ' + error)
    })
});

//deletes user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
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

app.listen(config.PORT, '0.0.0.0', () => {
  console.log('Listening on Port ' + config.PORT);
});