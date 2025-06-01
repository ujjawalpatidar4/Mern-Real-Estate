import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

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

export const deleteUser = async (req,res,next) => {
  if(req.user.id !== req.params.id){
    return next(errorHandler(401, 'You can only delete your own account!'));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.clearCookie('access_token')
    res.status(200).json({ success: true, message: 'User has been deleted' });
  } catch (error) {
    console.error('Error in deleteUser:', error); // Log the error
    next(error);
  }

}

// Show listing of that user
export const getUserListings = async (req, res, next) => {
  if(req.params.id !== req.user.id){
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
  else{
    try {
      const listings = await Listing.find({ userRef: req.params.id })
      res.status(200).json(listings);
    } catch (error) {
      console.error('Error in getUserListings:', error); // Log the error
      next(error);
    }
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
