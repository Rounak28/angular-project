const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Post = require('./models/post');
const mongoose = require('mongoose');

var uri = "mongodb://ronakrky:C822WoVZaa5UfBsC@cluster0-shard-00-00-knjm4.mongodb.net:27017,cluster0-shard-00-01-knjm4.mongodb.net:27017,cluster0-shard-00-02-knjm4.mongodb.net:27017/angular-test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";
mongoose.connect(uri , { useNewUrlParser: true })
.then(() => {
  console.log("Connected to db");
})
.catch((err) => {
  console.error("Connection failed",err.message);
});

app.use(bodyParser.json());

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods',"GET,POST,PATCH,DELETE,PUT");
  next();
});

app.post("/api/posts/",(req,res,next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  }); // mongoose.model give acces to constructor
  //console.log(post);
  post.save().then(result => {
    res.status(201).json({  // OK - new resource created
      message: 'Post added successfully',
      postId: result.id
    })
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({_id: req.params.id}, post)
  .then(result => {
    res.status(200).json( {message: "Updated Post"});
  }).catch(err => {
    res.json({message: "failed To update"});
  });;
});

app.delete("/api/posts/:id",(req,res,next) => {
  Post.deleteOne({_id: req.params.id})
  .then(result => {
    res.status(200).json({message: "Post Deleted"});
  }).catch(err => {
    res.json({message: "failed To delete"});
  });
});

app.use('/api/posts',(req,res,next) => {
  Post.find()
  .then((documents) => {
    //console.log(documents);
    res.status(200).json({posts: documents});
  });
  });

module.exports = app;
