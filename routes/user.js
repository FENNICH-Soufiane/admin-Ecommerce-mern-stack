const express = require('express');
const { verifyToken, verifyTokenAndAdmin } = require('./verifyToken');
const { verifyTokenAndAuthorization } = require('./verifyToken');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/User');

// update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
        const udateUser = await User.findByIdAndUpdate(
            req.params.id, {
            $set: req.body
        },
            { new: true }
        );
        res.status(200).json(udateUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted ...")
    } catch (error) {
        res.status(500).json(err)
    }
})

// get specific user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        return res.status(500).json(error);
    }
})

// Get All User
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query 
        ? await User.find().limit(query).sort({ _id: -1 }) 
        : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get each user created by month
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
          { $match: { createdAt: { $gte: lastYear } } },
          {
            $project: {
              month: { $month: "$createdAt" },
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: 1 },
            },
          },
        ]);
        res.status(200).json(data)
      } catch (err) {
        res.status(500).json(err);
      }

})

module.exports = router