const express = require('express');
const jwt = require('jsonwebtoken');
const request = require('request');

const app = express();
var bodyParser = require('body-parser');
var stripe = require("stripe")("sk_test_8L5vl0Q52BKgSWvBEuTohHcL");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
  // console.log(__dirname);
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/posts', verifyToken, (req, res) => {
  res.json({
    message: 'Post created...',
    authData: req.authData
  });
});

app.get('/api/pay', (req, res) => {
  res.sendFile(__dirname + '/payment.html');
});

app.post('/api/pay',verifyToken, (req, res) => {
  console.log(__dirname);
  console.log("1A");
  // res.json({
  //   message: 'Post created...'
  // });
  res.sendFile(__dirname + '/payment.html');

  // res.writeHead(301, {'Location': __dirname + '/payment.html'});
  // return res.end();
  // res.redirect(__dirname + '/payment.html');
    // res.location(__dirname + '/payment.html');
    // res.json({status: "Success", redirect:  __dirname + '/payment.html'});
});

app.post('/api/payment', (req, res) => {
  var users = new Map();
  users.set("admin","admin");
  if(users.get(req.body.username)==req.body.password){
    jwt.sign({user : req.body.username}, 'secretkey', { expiresIn: '1h' }, (err, token) => {
      // res.sendFile(__dirname + '/payment.html');
      // res.cookie('key',token);
      res.send(token)
    });
  }
  else{
    res.sendStatus(403);
  }
});
app.post('/api/charge',verifyToken, (req, res) => {

  const token = req.body.stripeToken; // Using Express

  const charge = stripe.charges.create({
    amount: 999,
    currency: 'usd',
    description: 'Example charge',
    source: token,
  });
});
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    jwt.verify(bearerToken, 'secretkey', (err, authData) => {
      if(err) {
        res.sendStatus(403);
      } else {
          req.authData = authData;
          next();
      }
    });
  } else {
    res.sendStatus(403);
  }

}

app.listen(5000);
