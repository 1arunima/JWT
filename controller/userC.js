const UserModel = require("../Model/user");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const SignUp = async (req, res, next) => {
  let existingUser;
  const { name, email, password } = req.body;
  console.log(req.body);
  //   const postUser = await UserModel.create({ name, email, password });
  existingUser = await UserModel.findOne({ email: email });
  if (existingUser) {
    res.status(400).json({ msg: `user with ${email} already exists` });
  }
  const encryptText = bcrypt.hashSync(password);
  console.log(encryptText);
  const user = new UserModel({
    name: name,
    email: email,
    password: encryptText,
  });
  await user.save();
  res.status(201).json({ user });
};

// const Login = async (req, res) => {
//   const { email, password } = req.body;
//   let userExisted;
//   userExisted = await UserModel.findOne({ email: email });
//   if (!userExisted) {
//     return res.status(400).json({ msg: "check credentials" });
//   }
//   const validPassword = bcrypt.compareSync(password, userExisted.password);
//   if (!validPassword) {
//     return res.status(404).json({ msg: `invalid credentials` });
//   }

//   const userToken = jwt.sign(
//     {
//       id: userExisted._id,
//     },
//     process.env.PORT = 5000

// ,
//     {
//       expiresIn: "1hr",
//     }
//   );

//   return res.status(200).json({ msg: "success", user: userToken });
// };
const Login = async (req, res) => {
  const { email, password } = req.body;
  let userExisted;
  userExisted = await UserModel.findOne({ email: email });
  if (!userExisted) {
    return res.status(400).json({ msg: "check credentials" });
  }
  const validPassword = bcrypt.compareSync(password, userExisted.password);
  if (!validPassword) {
    return res.status(404).json({ msg: `invalid credentials` });
  }

  const userToken = jwt.sign(
    {
      id: userExisted._id,
    },
    process.env.MY_KEY, // Use the secret key from the environment variable
    {
      expiresIn: "1hr",
    }
  );

  return res.status(200).json({ msg: "success", user: userToken });
};


const userVerification = (req, res, next) => {
  const header = req.headers["authorization"];
  const token = header.split(" ")[1];
  if (!token) {
    res.status(404).json({ msg: "invalid token" });
  }
  jwt.verify(token.toString(), process.env.MY_KEY, (error, user) => {
    if (error) {
      res.status(404).json({ msg: "invalid credentials" });
    }
    console.log(user);
    req.id = user.id;
    console.log(user.id);
    next();
  });
};

const getUser = async (req, res, next) => {
  console.log("hit")
  const UserId = req.id;
  let User;
  try {
    User = await UserModel.findById(UserId, "-password");
    
  } catch (error) {
    return new Error(error);
  }
  if (!User) {
    return res.status(404).json({ msg: "usernot found" });
  }
  return res.status(200).json(User);
};

module.exports = { SignUp, Login, userVerification, getUser };
