const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User")

router.post("/register", async (req, res) => {
    // Hash the password
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    try {
   

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }  catch (err) {
        res.status(500).json(err);
    }
})


router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    // Validate input
    if(!email || !password) {
        return res.status(400).json({message: "Email and password are required"});
    }

    try {
        // Check if user exists
        const user = await User.findOne({email: email});
        if(!user) {
            return res.status(400).json({message: "Invalid email or password"});
        }
        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(400).json({message: "invalid email or password"});
        }
        // Generate JWT
        const token = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin},
            process.env.JWT_SECRET,
            {expiresIn: "3d"}
        )
        return res.status(200).json({user, token});

    } catch(err) {
        return res.status(500).json("error on login");
    }
})
module.exports = router;