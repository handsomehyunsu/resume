const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    category: { type: String, required: true, default:"Category" },
    projectName: { type: String, required: true, default: "Project Name" },
    language: { type: String, default: "Language" },
    term: { type: String, default: "Term" },
    description: { type: String, default: "Description" },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Post', postSchema);