const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/students/User.js');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(await User.findOne({ email })) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    // TODO: Send verification email logic here
    res.status(201).json({ message: "Signup successful", user: { email: user.email, name: user.name } });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(404).json({ message: "User not found" });
    if(!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: "Invalid password" });
    // Only allow if verified
    if(!user.isVerified) return res.status(401).json({ message: "Email not verified" });
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: "Login successful", token, user: { name: user.name, email: user.email } });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
};
