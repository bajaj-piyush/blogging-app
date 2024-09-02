const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const Blog = require("./models/blog");

require("dotenv").config();

mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => console.log("MongoDB connected Successfully!"));

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static("./public"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", { user: req.user, blogs: allBlogs });
});

app.get("/your-blogs", async (req, res) => {
  const blogs = await Blog.find({ createdBy: req.user?._id });
  return res.render("home", { blogs: blogs, user: req.user });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () =>
  console.log(`Server Started Successfully at PORT:${PORT}!`)
);
