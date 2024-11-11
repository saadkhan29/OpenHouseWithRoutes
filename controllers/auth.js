const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

exports.signup = (req, res) => {
  res.render("auth/sign-up.ejs")
};

exports.signup_post = async (req, res) => {

  const userInDatabase = await User.findOne({ username: req.body.username });
  if(userInDatabase){
    return res.send("Username already taken")
  }

  if(req.body.password !== req.body.confirmPassword){
    return res.send("Password and Confirm Password must match")
  }

  // Register the user
  // bcrypt for password encryption
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  // Save/ Create the User
  const user = await User.create(req.body);
  res.send(`Thanks for signing up ${user.username}`);
}

exports.signin = (req, res) => {
  res.render("auth/sign-in.ejs");
};

exports.signin_post = async (req, res) => {
  try{
    const userInDatabase = await User.findOne({ username: req.body.username});
  if(!userInDatabase){
    return res.send("Login failed. Please try again.")
  }

  const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
  if(!validPassword){
    return res.send("Login failed. Please try again.")
  }

  // Log the user in.
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };
  req.session.message = "User logged in suceesfully";
  res.redirect("/");

  }catch(err){
    console.log(err);
    req.session.message = "Please try again later";

  }
  
}

exports.signout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
}
