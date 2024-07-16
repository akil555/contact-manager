const userModel = require('../models/user')

module.exports.register = async(req,res)=>{
    try
    {
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send("User Registered Successfully");
    }
    catch(err)
    {
        res.status(500).send({ message: 'User registration failed', error: err });
    }
}

module.exports.login = async(req,res)=>{
    const  {email, password}  = req.body;
    try
    {
        const user = await userModel.findOne({email,password});
        if(user){
            const temp = {
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
                role:user.role,
                _id:user._id,
            }
            res.status(200).send(temp);
        }
        else
        {
            res.status(401).send({ message: "Login Failed: Invalid email or password" });
        }
    }
    catch(err)
    {
        res.status(500).send({ message: 'Login failed', error: err });
    }
}

module.exports.getallusers = async(req,res)=>{
    try
    {
        const users = await userModel.find({});
        res.send(users);
    }
    catch(err)
    {
        res.status(500).send({ message: 'Fetching users failed', error: err });
    }
}

module.exports.getuser = async (req, res) => {
    const {email,password} = req.body;
    try {
        const users = await userModel.find({email,password});
        res.send(users);
    }
    catch (err) {
        res.status(500).send({ message: 'Fetching user failed', error: err });
    }
}