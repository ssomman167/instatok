const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { blacklist } = require('../blacklist');

// Registration route
router.get("/",(req,res)=>{
  res.send("Welcome to RegisterPage")
})

router.post('/register', async (req, res) => {
  try {
    const { username, email, dob, role, location, password } = req.body;
    // Check if the password and confirm password match
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      dob,
      role,
      location,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if the password is valid
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id,username:username }, 'secretKey');

    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/logout",async(req,res)=>{
  const token= req.headers.authorization?.split(" ")[1]
  try{
    blacklist.push(token)
    res.json({message: 'Logged out'})
  }
  catch(err){
    console.log(err)
  }

})

module.exports = router;
