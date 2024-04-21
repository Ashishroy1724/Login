// server.js

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

mongoose.connect('mongodb+srv://ashish:ashish@login.xvtf26p.mongodb.net/Database?retryWrites=true&w=majority&appName=login', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  phno: String,
  gender: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.post("/sign_up", async (req, res) => {
  const {
    name,
    age,
    email,
    phno,
    gender,
    password
  } = req.body;

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {
      // If the user with the same email already exists, return an error
      return res.status(400).send("User with this email already exists");
    }

    // If the email is unique, proceed with creating the new user
    const newUser = new User({
      name,
      age,
      email,
      phno,
      gender,
      password
    });

    await newUser.save();
    console.log("Record Inserted Successfully");
    // Set isAuthenticated session variable to true upon successful registration
    req.session.isAuthenticated = true;
    return res.redirect('signup_successful.html');
  } catch (err) {
    console.error("Error saving user:", err);
    // Send the error message as a response
    return res.status(500).send(err.message);
  }
});

app.get("/checkAuth", (req, res) => {
  // Check if the user is authenticated
  const isAuthenticated = req.session.isAuthenticated || false;
  res.json({
    isAuthenticated
  });
});

// Other routes and middleware...

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
