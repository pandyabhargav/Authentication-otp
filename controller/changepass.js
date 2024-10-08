const otpGenerator = require('otp-generator');
const User = require('../config/mongose');
const bcrypt = require('bcrypt');



let generatedOTP = null; // OTP storage

// Render the forgot password form
const forgotpaForm = (req, res) => {
  res.render('forgetForm');
};

// Generate OTP
const otpGenerate = async (req, res) => {
  const { useremail } = req.body;

  if (!useremail) {
    return res.status(400).send("User email is required");
  }

  try {
    const user = await User.findOne({ email: useremail });

    if (!user) {
      return res.status(404).send("User not found");
    }

    generatedOTP = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    // Save the OTP in session
    req.session.generatedOTP = generatedOTP;

    console.log(`Generated OTP for ${useremail}: ${generatedOTP}`);

    // Redirect to OTP form, pass user ID
    return res.redirect(`/otpForm?userId=${user._id}`); // Redirect to OTP form with user ID
  } catch (error) {
    console.error("Error while generating OTP:", error);
    res.status(500).send("Internal server error");
  }
};

// Render the OTP form
// In your controller where you render the OTP form
const otpForm = (req, res) => {
  const userId = req.query.userId; // or however you are passing the userId
  res.render('otpForm', { userId,otp: generatedOTP  }); // Pass userId to the view
};


const forgotpassForm = (req, res) => {
  const userId = req.params.userId;
  res.render('forgotpass', { userId });
};

// Verify the OTP
const verifyOTP = (req, res) => {
  const otpArray = req.body.otp; // This should be an array from the form
  const submittedOTP = otpArray.join(''); // Join the OTP array to a string
  const userId = req.params.userId; // Retrieve user ID from route parameters

  const generatedOTP = req.session.generatedOTP; // Get the generated OTP from session

  if (submittedOTP === generatedOTP) {
    console.log("hi");
    
    return res.redirect(`/forgotPassword/${userId}`); // Redirect with user ID
  } else {
    console.log("err");
    
    return res.render('otpForm', { error: 'Invalid OTP, please try again.', userId ,otp: generatedOTP});
  }
};



const forgotpasslogic = async (req, res) => {
  const userId = req.params.userId; // Get userId from URL parameters
  const { New_password, conf_password } = req.body;

  // Check if userId is provided
  if (!userId) {
    return res.redirect(`/forgotPassword/${userId}`); // Redirect if userId is not provided
  }

  // Check if passwords match
  if (New_password !== conf_password) {
    console.log("errrrr");
    
    return res.redirect(`/forgotPassword/${userId}`); // Redirect if passwords do not match
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    
    // Check if user exists
    if (!user) {
      return res.redirect('/register'); // Redirect if user not found
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(New_password, 10);
    
    // Update the user's password
    await User.updateOne({ _id: userId }, { password: hashedPassword });
    
    return res.redirect('/login'); // Redirect to login after successful password change
  } catch (error) {
    console.error("Error updating password:", error);
    return res.redirect(`/forgotPassword/${userId}`); // Redirect on error
  }
};



module.exports = {
  forgotpaForm,
  otpGenerate,
  otpForm,
  verifyOTP,
  forgotpassForm,
  forgotpasslogic
};
