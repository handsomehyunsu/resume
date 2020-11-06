const express = require('express');

const PostController = require("../controllers/posts");

const checkAuth = require('../middleware/check-auth');

const router = express();

router.post('',checkAuth, PostController.createPost);

//PUT은 전체 엔티티를 전달해줘야하고, PATCH는 변경하고자 하는 속성만 전달해주면 된다. 이름만 바꾼다거나.
//PUT에 전달한 엔티티에 일부 속성이 누락될 경우 해당 속성은 API 호출 후 값이 유실된다.(매우 중요)
//PUT은 대체한다는 개념으로 보면 된다. 없으면 생성도 된다.
router.put('/:id',checkAuth, PostController.updatePost);

router.get('', PostController.getPosts);

router.get('/:id',checkAuth, PostController.getPost);

router.delete('/:id',checkAuth, PostController.deletePost);

module.exports = router;