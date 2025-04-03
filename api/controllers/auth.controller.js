import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const Signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    try {
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, email, password:hashedPassword });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
}

export const SignIn = async (req, res,next) => {
    const {email, password} = req.body;
    try{
        // check if user exists
        const UserExist = await User.findOne({email});
        if(!UserExist) return next({statusCode:400,message:"User not found"});
        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, UserExist.password);
        if(!isPasswordCorrect) return next({statusCode:401,message:"Invalid credentials"});


        const token = jwt.sign({id:UserExist._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        const {password:pass,...user}= UserExist._doc;
        
        res.cookie("access_token",token,{httpOnly:true}).status(200).json({user});

    }
    catch(error){
        next(error);
    }
}    