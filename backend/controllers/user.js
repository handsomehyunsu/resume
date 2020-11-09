const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jsonwebtoken = require('../globalConstantShare/jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
    //10 is salt-round
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                userName: req.body.userName,
                password: hash
            });
        user.save()
            .then(result => {
                console.log("여기는되냐?")
                res.status(201).json({result: result});
            })
            .catch(err => {
                console.log("여기냐?");
                res.status(500).json({message:"Invalid authentication credentials!!"});
            });
        });
};

exports.loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ userName: req.body.userName })
        .then(user => {
            if(!user){
                return res.status(401).json({
                    message: "No user information founded!"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if(!result){
                return res.status(401).json({
                    message: "Password Failed! "
                });
            }
            const token = jwt.sign(
                {userName: fetchedUser.userName, userId: fetchedUser._id},
                jsonwebtoken,
                {expiresIn: "1h" }
                );
                console.log(fetchedUser);
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            return res.status(401).json({
                message: "Invalid authentication credentials!!"
            });
        })
    };