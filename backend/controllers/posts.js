const Post = require('../models/post');

exports.createPost = (req, res, next) => {
    const post = new Post({
        category: req.body.category,
        projectName: req.body.projectName,
        language: req.body.language,
        term: req.body.term,
        description: req.body.description,
        creator: req.userData.userId
    });
    //save method is provided by mongoose package for every model created
    post.save().then(createdPost => {
        res.status(201).json({
            postId: createdPost._id
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Creating a post failed!"
        })
    });
};

exports.updatePost = (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        projectName: req.body.projectName,
        language: req.body.language,
        term: req.body.term,
        description: req.body.description,
        creator: req.userData.userId
    })
    Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if (result.n > 0) {
            res.status(200).json(console.log("update successsssss"));
          } else {
            res.status(401).json(console.log("update failllllllllllll"));
          }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't update post!"
        });
    });
};

exports.getPosts = (req, res, next) => {
    Post.find().then(documents => {
       console.log(documents);
       res.status(200).json({
        message: "Posted!!",
        posts: documents
        });
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        });
    });
};

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json(console.log("fail"));
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching post failed!"
        });
    });
};

exports.deletePost = (req, res, next) => {
    Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: "Deletion successful!" });
          } else {
            res.status(401).json({ message: "Not authorized!" });
          }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching posts failed!"
        });
    });
};