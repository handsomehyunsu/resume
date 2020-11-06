const jwt = require('jsonwebtoken');

//미들웨어로 인증처리가 되기 때문에 클라이언트의 요청이 컨트롤러에서 도착하기 전에 여기서 인증과정을 거침
//request의 header의 Authorization에서 토큰을 추출함. 여기서 추출한 토큰은 'bearer fijsdfsjadofaf'
//이런식으로 bearer도 같이 오기때문에 split을 이용해서 제거함.
module.exports = (req, res, next) => {
    try{
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userName: decodedToken.userName, userId: decodedToken.userId };
    next() //정상적으로 인증된 후 다음 미들웨어가 있다면 거기로 보냄
    }catch(err){
        res.status(401).json({ message:"You are not authenticated!" });
    }
};