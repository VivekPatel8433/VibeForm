import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

// REGISTER
export const Register =  async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN 
export const Login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check if the email exist / User exist? 
        const user = await User.findOne({email}); 
        if (!user) return res.status(400).json({ message: "Invalid Email or Password" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password); 
        if(!isMatch) return res.status(400).json({message: "Invalid Email or Password"});

        const token = jwt.sign({
          id: user._id,
          email: user.email
        }, process.env.JWT_SECRET, {
          expiresIn: "7d"
        })

        res.status(200).json({token, user: {
          id: user._id,
          email: user.email
        }})
    } catch (error) {
      res.status(500).json({message: "Server error"});
    }
  };
