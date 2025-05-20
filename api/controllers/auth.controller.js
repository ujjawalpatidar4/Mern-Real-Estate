import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const Signup = async (req, res,next) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password:hashedPassword });

    try {
        await newUser.save();
        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error);
    }
}

export const SignIn = async (req, res,next) => {
    const {email, password} = req.body;
    try{
        // check if user exists
        const UserExist = await User.findOne({email});
        if(!UserExist) return next(errorHandler(404, 'User not found!'));
        // check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, UserExist.password);
        if(!isPasswordCorrect) return next(errorHandler(401, 'Wrong credentials!'));


        const token = jwt.sign({id:UserExist._id},process.env.JWT_SECRET,{expiresIn:"1d"});
        const {password:pass,...rest}= UserExist._doc;
        
        res.cookie("access_token",token,{httpOnly:true}).status(200).json(rest);

    }
    catch(error){
        next(error);
    }
}    

export const GoogleSignIn = async (req, res,next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user){
            const token = jwt.sign({id:user._id,},process.env.JWT_SECRET,{expiresIn:"1d"});
            const {password:pass,...restData}= user._doc;
            res.cookie('access_token',token,{httpOnly:true}).status(200).json(restData);
        }else{
            const randomPassword = Math.random().toString(36).slice(-8);   // this will generate random password using 0-9 and a to z , then slice gives us last 8 digits as password
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            const newUser = await User.create({ username:req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-4),email:req.body.email, password:hashedPassword , avatar:req.body.photo}); // here username is like Ujjawal Patidar , so we have to convert it like ujjawalpatidar897534 ( so that it will be unique).
            await newUser.save();
            const token = jwt.sign({id:newUser._id,},process.env.JWT_SECRET,{expiresIn:"1d"});
            const {password:pass,...restData}= newUser._doc;
            res.cookie("access_token",token,{httpOnly:true}).status(200).json(restData);
            console.log(newUser.avatar);
        }
    } catch (error) {
        next(error);
    }
}    

export const SignoutUser = async (req,res,next) => {
    
    try {
        res.clearCookie('access_token')
        res.status(200).json({ success: true, message: 'User has been Signed Out' }); 
    } catch (error) {
        console.log("Signout error : ",error);
        next(error);
    }
  }