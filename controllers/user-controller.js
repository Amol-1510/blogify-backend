import User from "../model/User";
import bcrypt from "bcryptjs";

export const getAllUser = async(req,res,next) =>{
    let users;
    try{
        users = await User.find();
    }catch(err){
        return console.log(err);
    }

    if(!users){
        return res.status(404).json({message:`No User Found!!!`});
    }

    return res.status(200).json({users});
};



export const signup = async (req,res,next) =>{
    const {name,email,password} = req.body;

    let existingUser;
    try{
        existingUser = await User.find({email});
    }
    catch(err){
        return console.log(err);
    }

    if(!existingUser){
        return res.status(400).json({message:"User Already Present! Login Instead"});
    }
    
    const hashPassword = bcrypt.hashSync(password);

    const user = new User({
        name,
        email,
        password: hashPassword,
        blogs:[]
    });


    try{
       await user.save();
    }
    catch(err){
        console.log(err);
    }

    return res.status(201).json({user});
};

export const login = async (req,res,next) =>{
    const {email,password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
        return console.log(err);
    }

    if(!existingUser){
        return res
        .status(404)
        .json({message:"Invalid Email!!"});
    }

    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);

    if(!isPasswordCorrect){
        return res
        .status(400)
        .json({message:"Invalid Password!!"});
    }

    return res.status(200).json({message:"Login Successfull!!",user : existingUser});

};