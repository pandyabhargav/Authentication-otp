const express = require('express');
const session = require('express-session');
const passport = require('./config/passport');
const router = require('./Router/router');
const blogrouter = require('./Router/blogroutes');
const passwordRoute = require('./Router/changepssRout');
const path = require('path');
const mongoose = require('./config/mongose')
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');



// Use methodOverride for forms with _method input






const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname , 'views')));
// Serve static files from the "css" directory
app.use('/css', express.static(path.join(__dirname, 'css')));




app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'yourSecret', // Replace with a strong secret
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/',router,blogrouter,passwordRoute);





app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
