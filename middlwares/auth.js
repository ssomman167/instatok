// authMiddleware.js

const jwt = require('jsonwebtoken');
const { blacklist } = require('../blacklist');

const authMiddleware = (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    if(blacklist.includes(token)){
      return res.status(401).json({ message: 'Login again'})
    }
    // Verify the token
    const decodedToken = jwt.verify(token, 'secretKey');

    // Set the user ID in the request for further use
    req.userId = decodedToken.userId;
    req.username=decodedToken.username

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
