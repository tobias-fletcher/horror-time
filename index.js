const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
  {
  title: 'You should have left'
},
  {
    title:'A quiet place'
  },
  {
    title: 'Black Box'
  },
  {
    title: 'The invisible man'
  },
  {
    title: 'Midsommar'
  },
  {
    title: 'Antebellum'
  },
  {
    title: 'Ma'
  },
  {
    title: 'Us'
  },
  {
    title: 'Hereditary'
  },
  {
    title: 'Mother'
  },
  {
    title: 'Bird Box'
  }
];

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  res.send('Welcome to Horror Time');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use(express.static('Public'));

app.listen(8011, () => {
  console.log('App is listening on port 8011');
});
