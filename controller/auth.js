const asyncHandler = require("express-async-handler");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../middleware/authMiddleware");

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(400).json({ message: "No Token found!" });
  }
  res.json(user);
});

const registerUser = asyncHandler(async (req, res) => {
  //Get details from request
  const { firstname, lastname, email, password, phone_no } = req.body;

  //Throw error if user details is not filled
  if (!firstname || !lastname || !email || !password) {
    res.status(400).json("Please add required fields");
  }

  //Check if user already exists
  const checkUser = await User.findOne({ email });

  //Throw error if user already exists
  if (checkUser) {
    res.status(400).json("User with this email already exists");
  }

  //Generate hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create or Register new User
  const user = await User.create({
    first_name: firstname,
    last_name: lastname,
    email: email,
    password: hashedPassword,
    phone_no: phone_no,
  });

  //Send newly Created User
  if (user) {
    res.send({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_no: user.phone_no,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json("Invalid User Data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check for user email
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({ message: "User does not exist!" });
  }

  if (user.is_admin) {
    res.status(401).json({ message: "Unauthorized access!" });
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const foundUser = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: generateToken(user._id),
    };

    res.send(foundUser);
  } else {
    res.status(400).json({ message: "Invalid Login Details" });
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { old_password, new_password } = req.body;
  //Get user Details
  const foundUser = await User.findById(req.user._id);
  if (foundUser.is_admin) {
    res.status(400).json({ message: "Unauthorized access" });
  }
  //Compare user details with former password
  if (foundUser && (await bcrypt.compare(old_password, foundUser.password))) {
    //Generate salt for new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);
    //change password if true
    const newUser = await User.findByIdAndUpdate(
      foundUser._id,
      {
        password: hashedPassword,
      },
      { new: true }
    ).select("-password");

    //return user details
    res.send({ ...newUser, token: generateToken(newUser._id) });
  } else {
    res.status(400).json({ message: "Invalid Password" });
  }
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const userDetails =  req.body;
  //Get user Details
  const foundUser = await User.findById(req.user._id);
  if (foundUser.is_admin) {
    res.status(400).json({ message: "Unauthorized access" });
  }
  //change password if true
  const newUser = await User.findByIdAndUpdate(
    foundUser._id,
    userDetails, {new: true}).select("-password");
  res.send({...newUser, token: generateToken(newUser._id)})
});

const deleteUserAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.sendStatus(200);
});
module.exports = {
  getUserDetails,
  registerUser,
  loginUser,
  updateUserPassword,
  deleteUserAccount,
  updateUserDetails,
};
