const config = require('./config');
const jwtSecret = config.JWT_SECRET; 

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); 

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username, 
    expiresIn: '7d', 
    algorithm: 'HS256' 
  });
}

/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}



//mongoimport --uri mongodb+srv://horrorTimeadmin:Pulsar_07@cluster0.lfvar.mongodb.net/horrorTimeadmindb --collection movies --type JSON --file C:\Users\tobia\Desktop\2.7\movies




