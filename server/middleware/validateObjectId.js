import mongoose from 'mongoose';

/**
 * Middleware to validate one or more MongoDB ObjectId URL parameters.
 * 
 * @param {string} [paramName='id'] - Parameter key to validate
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format for parameter "${paramName}".`,
      });
    }
    next();
  };
};

export default validateObjectId;

