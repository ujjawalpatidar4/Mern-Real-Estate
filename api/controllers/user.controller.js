import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const test = (req, res) => {
    res.json({ message: 'User route is working!' });
};

export const updateUser = async (req, res, next) => {
  
    if (req.user.id !== req.params.id){
      return next(errorHandler(401, 'You can only update your own account!'));
    }
    try {
      if (req.body.username) {
          const existingUser = await User.findOne({ username: req.body.username });
          if (existingUser && existingUser._id.toString() !== req.params.id) {
              return next(errorHandler(400, 'Username is already taken.'));
          }
      }
        if (req.body.email) {
          const existingUser = await User.findOne({ email: req.body.email });
          if (existingUser && existingUser._id.toString() !== req.params.id) {
              return next(errorHandler(400, 'Email is already registred.'));
          }
      }
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
  
      const { password, ...rest } = updatedUser._doc;
  
      res.status(200).json(rest);
      
    } catch (error) {
      console.error('Error in updateUser:', error); // Log the error
      next(error);
    }
  };