const publicIp = require("public-ip");

const expressMiddleware = async (req, res, next) => {
    req.ip = await publicIp.v4();
  next();
};

module.exports = { expressMiddleware };