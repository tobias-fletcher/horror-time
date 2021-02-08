const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

app.use(express.static('Public'));

app.use(bodyParser.json());

let movies = [
  {
  title: 'You should have left',
  director: 'Dave Koepp',
  year: '2020'

},
  {
    title:'A quiet place',
    director: 'John Krasinski',
    year: '2018'
  },

  {
    title: 'Black Box',
    director: 'Emmanuel Osei-Kuffour Jr.',
    year: '2020'
  },
  {
    title: 'The invisible man',
    director: 'Leigh Whannel',
    year: '2020'
  },
  {
    title: 'Midsommar',
    director: 'Ari Aster',
    year: '2019'
  },
  {
    title: 'Antebellum',
    director: 'Gerard Bush',
    year: '2020'
  },
  {
    title: 'Ma',
    director: 'Tate Taylor',
    year: '2019'
  },
  {
    title: 'Us',
    director: 'Jordan Peele',
    year: '2019'
  },
  {
    title: 'Hereditary',
    director: 'Ari Aster',
    year: '2018'
  },
  {
    title: 'Mother',
    director: 'Darren Aronofsky',
    year: '2017'
  },
  {
    title: 'Bird Box',
    director: 'Susanne Bier',
    year: '2018'
  }
];

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//get requests
app.get('/', (req, res) => {
  res.send('Welcome to Horror Time');
});

//get list of data of movies
app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title
  }));
});

app.get('/movies/year/:title', (req, res) => {
  res.send('GET request successful - movie year by title')
});

app.get('/movies/directors/:name', (req, res) => {
  res.send('GET request sucessful - movie director');
});

app.post('/users', (req, res) => {
  res.send('POST request successful - new user registered');
});

app.put('/users/username', (req, res) => {
  res.send('PUT request successful = updated information');
});

app.post('/users/:username/movies/:title', (req, res) => {
  res.send('POST request successful - added movie to list');
});

app.delete('/user/:username/movies/:title', (res, req) => {
  res.send('DELETE request successful - movie removed');
});

app.delete('/user/:username', (req, res) => {
  res.send('DELETE request successful - user account terminated');
});

app.listen(8022, () => {
  console.log('App is listening on port 8022');
});
