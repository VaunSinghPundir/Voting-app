// const express = require("express");

// const router = express.Router();

// const User = require("./../models/user.js");

// const { jwtAuthMiddleware, generateToken } = require("./../jwt.js");

// router.post("/signup", async (req, res) => {
//   try {
//     const data = req.body; //Assuming the request body contains the user data

//     //Create a new user document useing the Mongoose model
//     const newUser = new User(data);

//     // Save the new user to the database
//     const response = await newUser.save();
//     console.log("data saved");

//     const payload = {
//       id: response.id,
//     };
//     console.log(JSON.stringify(payload));
//     const token = generateToken(payload);

//     console.log("Token is: ", token);

//     res.status(200).json({ response: response, token: token });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { aadharCardNumber, password } = req.body;

//     const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

//     if (!user || !(await user.comparePassword(password))) {
//       res.status(401).json({ error: "Invalid Username or Password" });
//     }
//     const payload = {
//       id: user.id,
//     };
//     const token = generateToken(payload);
//     res.json({ token });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Invalid server error" });
//   }
// });

// router.get("/profile", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const userData = req.user;
//     const userId = userData.id;
//     const user = await User.findById(userId);

//     res.status(200).json({ user });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Invalid server error" });
//   }
// });

// // Update collections

// router.put("/profile/password",jwtAuthMiddleware,  async (req, res) => {
//   try {
//     const userId = req.user; // extract the id from the token

//     const {currentPassword, newPassword} = req.body;

//     const user = await User.findById(userId);

//     if (!(await user.comparePassword(currentPassword))) {
//         res.status(401).json({ error: "Invalid Username or Password" });
//       }

//       user.password = newPassword;
//       await user.save();

//     console.log("password updated");
//     res.status(200).json({message: "password updated"});
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports = router;



const express = require('express');
const User = require('../models/user');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

const router = express.Router();

router.post('/signup', async(req, res)=>{
  try {
    const data = req.body;
    
    const adminUser = await User.findOne({role: "admin"});
    if(data.role === "admin" && adminUser){
      return res.status(404).json({error : "Admin user aleardy exists"})
    }
    const newUser = new User(data);
    const response = await newUser.save();

    console.log("data Saved");

    const payload = {
      id: response.id,
    }
    console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is : ", token);

    
    res.status(200).json({response: response, token: token})

  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Invalid server error"})
  }
})

router.post('/login', async (req, res)=>{

  try {
    const {aadharCardNumber, password} = req.body;

    const user = await User.findOne({aadharCardNumber: aadharCardNumber});

    if(!user || !(await user.comparePassword(password))){
      res.status(401).json({error: "Invalid username or password"})
    }
    const payload = {
      id: user.id
    }
    const token = generateToken(payload);
    res.status(200).json({token})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Invalid server error"})
  }
})

router.get('/profile', jwtAuthMiddleware, async (req, res)=>{
  try {
    const userData = req.user
    const userId = userData.id;

    const user = await User.findById(userId);
    res.status(200).json({user})
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Invalid server error"})
  }
})

router.put('/profile/password',jwtAuthMiddleware ,async (req, res)=>{

  try {
    const userId = req.user;

    const user = await User.findById(userId);
    const {currentPassword, newPassword} = req.body;

    if(!(await user.comparePassword(currentPassword))){
      res.status(401).json({error : "Incorrect password"})
    }

    user.password = newPassword;
    await user.save();
    console.log("password update")

    res.status(200).json({message: "password updated"})

  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Invalid server error"})
  }
})

module.exports = router;