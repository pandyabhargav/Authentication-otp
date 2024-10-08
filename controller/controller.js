const bcrypt = require('bcrypt');
const User = require('../config/mongose'); 
const passport = require('../config/passport'); 




const saltRounds = 10; 

// Render the home page
const defaultCon = async (req, res) => {
  console.log("defaultCon");
  if (req.isAuthenticated()) {
    // If the user is authenticated, show the home page
    console.log("Returning user. Showing home page.");
    console.log( req.user.name);
    
    return res.render('index', { userName: req.user.name });
  }
  
  // If not authenticated, render the signup page
  console.log("First-time visitor. Showing signup page.");
  return res.render('singup');
};

// Render the signup form
const signupForm = (req, res) => {
  res.render("singup", { error: null });
};

const handleSignup = async (req, res) => {
  const { name, email, password, conf_password } = req.body;

  // Check if password and confirm password match
  if (password !== conf_password) {
    return res.render("singup", { error: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("User signed up. Redirecting to login.");
    res.redirect('/login');
    
  } catch (error) {
    // Handle duplicate email errors (Mongoose unique validation)
    if (error.code === 11000) {
      return res.render("singup", { error: "Email is already registered" });
    }
    console.error("Error during signup:", error);
    res.render("singup", { error: "An error occurred during signup. Please try again." });
  }
};

// Render the login form
const loginForm = (req, res) => {
  res.render('login');
};

// Handle login form submission
const handleLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send(info.message);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
};

const handleLogout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
    }
    console.log("User logged out. Redirecting to login.");
    res.redirect('/login'); // Redirect to the login page
  });
};


const changepassForm =(req,res)=>{

  res.render('chngepass');
}

const changepass =(req,res)=>{
  const { current_password, new_password, conf_password } = req.body;

  const {password} = req.user;
  if (req.user) {

    bcrypt.compare(current_password,password ,(err,r)=>{
      if (r) {
        console.log('pass match');
        bcrypt.hash(new_password, 10,async(err,hashedPassword)=>{
          const update = await User.updateOne({_id:req.user._id},{password:hashedPassword})
          console.log("update" ,update);
          
        });

        res.redirect('/login');
      }else{
        console.log('pass not match');
        res.redirect('/chagepass')
      }
    });
    
  }else{
    res.redirect('/chagepass');
  }
}



module.exports = { defaultCon, signupForm, handleSignup, loginForm, handleLogin, handleLogout,changepass,changepassForm};

