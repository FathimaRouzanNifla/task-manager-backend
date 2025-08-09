const { verifyToken } = require('../config/jwt');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // If not found in header, check cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If no token, return 401 error
  if (!token) {
    return next(new ErrorResponse('Not authorized, no token', 401));
  }

  try {
    // Verify token and get payload
    const decoded = verifyToken(token);

    // Attach user info to request, exclude password field
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized, token failed', 401));
  }
};

module.exports = { protect };
