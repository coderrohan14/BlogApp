const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = 'This is a Blog website made using EJS,CSS, NodeJS, MongoDB, and Express. You can navigate to the compose page by clicking on the compose link on the top right corner of this page. You can access the previously added posts by either clicking on the "Read More" link or navigating to "/posts/<post_id> route".';
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

dotenv.config({ path: "./config.env" });

const atlas_username = process.env.ATLAS_USERNAME;
const atlas_password = process.env.ATLAS_PASSWORD;

mongoose.set('strictQuery', false);

mongoose.connect(`mongodb+srv://${atlas_username}:${atlas_password}@cluster0.ghm14at.mongodb.net/blogDB`);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const blogSchema = {
  title: String,
  content: String
};

const Blog = mongoose.model("Blog", blogSchema);

app.get("/", function (req, res) {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home",
        { homeStartingContent: homeStartingContent, posts: blogs });
    }
  })
})

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
})

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
})

app.get("/compose", function (req, res) {
  res.render("compose");
})

app.get("/posts/:postId", function (req, res) {
  const postId = req.params.postId;
  Blog.findById(postId, (err, blog) => {
    if (err) {
      res.render("post", { title: "No such post exists!", content: "" });
    } else {
      res.render("post", { title: blog.title, content: blog.content });
    }
  })
})


app.post("/compose", function (req, res) {
  const post = new Blog({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");
})

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 3000;
}

app.listen(PORT, function () {
  console.log(`Server started on ${PORT}`);
});
