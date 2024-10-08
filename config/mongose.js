const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabase', {
  useNewUrlParser: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  
    trim: true       
  },
  email: {
    type: String,
    required: true, 
    unique: true,    
    lowercase: true,
    trim: true      
  },
  password: {
    type: String,
    required: true   
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

// Create User model
const User = mongoose.model('User', userSchema);


// Export User model
module.exports = User;
