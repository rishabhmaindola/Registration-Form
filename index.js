const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/form"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/form/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      res.redirect("/existing");
    } else {
      const { name, email, phone, password } = req.body;
      const newUser = new User({
        name,
        email,
        phone,
        password,
      });
      await newUser.save();
      res.redirect("/success");
    }
  } catch (err) {
    console.error("Error", err);
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/form/success.html");
});

app.get("/existing", (req, res) => {
  res.sendFile(__dirname + "/form/existing.html");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
