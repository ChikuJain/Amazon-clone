const userModel = require('../models/userModel')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validateString,
    validateNumber,
    validateRequest,
    validateEmail,
    regexPhoneNumber,
    regxName,
    isValidPincode,
    validatePassword,
    imageExtValidator, 
    onlyWholeNumbers,
startWithZero} = require("../validator/validations")

let createUser = async function(req,res){
    try {
        let data = req.body
        if(typeof data.address=="string"){
        try {
            data.address = JSON.parse(data.address)
        } catch (err) { return res.status(400).send({ status: false, message: "please type address correctly or provide pincode not starting with 0" }) }
    }
        let {  fname, email, password, mobile } = data
        if (validateRequest(data)) { return res.status(400).send({ status: false, message: "please provide the data in the body" }) }

        if (!validateString(fname)) { return res.status(400).send({ status: false, message: "please provide the name" }) }
        if (!regxName(fname)) { return res.status(400).send({ status: false, message: "please provide a valid name" }) }

        if (!validateString(email)) { return res.status(400).send({ status: false, message: "please provide the email" }) }
        if (!validateEmail(email)) { return res.status(400).send({ status: false, message: "please provide a valid email" }) }

        if (!validateString(mobile)) { return res.status(400).send({ status: false, message: "please provide the phone number" }) }
        if (!regexPhoneNumber(mobile)) { return res.status(400).send({ status: false, message: "please provide a valid phone number" }) }

        if (!validateString(password)) { return res.status(400).send({ status: false, message: "please provide the password" }) }
        if (!validatePassword(password)) { return res.status(400).send({ status: false, message: "Please provide a valid password with atleast one uppercase one lowercase  one special character and must contain atleast 6 characters" }) }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt);
        data.password = encryptedPassword


        let isDuplicateEmail = await userModel.findOne({ email: data.email })
        if (isDuplicateEmail) { return res.status(400).send({ status: false, message: "This email is already exists" }) }

        let isDuplicatePhone = await userModel.findOne({ mobile: data.mobile })
        if (isDuplicatePhone) { return res.status(400).send({ status: false, message: "This phone number is already exists" }) }

        let createdData = await userModel.create(data)
        res.status(201).send({ status: true, message: "user registered successfully", data: createdData })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}

let userLogin = async function (req, res) {
    try {
        let email = req.body.email
        let password = req.body.password
        if (!validateString(email)){return res.status(400).send({ status: false, message: "email is required" })}
        if (!validateEmail(email)){ return res.status(400).send({ status: false, message: "please provide a valid email" }) }
        
        if (!validateString(password)) {return res.status(400).send({ status: false, message: "password is required" })}
        
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).send({status: false,message: "email is not correct",});

        const passwordDetails = await bcrypt.compare(password, user.password)
        if (!passwordDetails) return res.status(401).send({ status: false, message: "password is incorrect, please provide correct password" })
        
        let token = jwt.sign(
            {
                _id: user._id.toString(),
                iat: new Date().getTime(), 
            },
            "functionup-radon",
        );
        res.cookie("jwtoken",token,{
            expires: new Date(Date.now() + 900000),
            httpOnly:true
        });

        res.status(200).send({userId: user._id, userName:user.fname, token: token});
    }
    catch (err) {
        console.log(err)
        return res.status(500).send({ status: false, message: err.message })
    }
}

let userLogout = async function(req,res){
    try{
        res.clearCookie("jwtoken", { path: "/" });
        res.status(201).send({status:true,message:"user logout successfully"})
    }
    catch(err){
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

let getUserData = async function(req,res){
    try{
        res.status(200).send({userName:req.userData.fname})
    }
    catch(err){
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports ={createUser,userLogin,userLogout,getUserData}