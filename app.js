const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();




// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');




//Start server
app.listen(3000, function(){
  console.log('Server started on port 3000...');
});

app.get('/', function(req, res){
	res.render('layout');
});
