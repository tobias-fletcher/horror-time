const express = require('express');
const app = express();

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


app.get('/', (req, res) => {
  res.send('Welcome to Horror Time');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use('/documentation.html', express.static('public'));

app.listen(8000, () => {
  console.log('App is listening on port 8000');
});
