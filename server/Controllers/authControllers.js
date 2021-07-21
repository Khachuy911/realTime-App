const users = require("../Models/UsersModel");
const asyncHandle = require("../Middleware/asyncHandle");
const errorResponse = require("../helpers/ErrorResponse");
const jwt = require("jsonwebtoken");
const clientRedis = require("../Config/redis");
const { promisify } = require("util");
module.exports = {
  signup: asyncHandle(async (req, res) => {
    const data = req.body;
    const user = await users.create(data);
    const token = user.signToken();
    const refreshToken = user.signRefreshToken();
    res.status(200).json({
      status: "sucess",
      token,
      refreshToken,
    });
  }),
  login: asyncHandle(async (req, res, next) => {
    const data = req.body;
    if (!data)
      return next(new errorResponse(401, "email or password not exists"));
    const user = await users.findOne({ email: data.email });
    if (!user || !(await user.matchPassword(data.password, user.password)))
      return next(new errorResponse(401, "user or password wrong"));
    const token = user.signToken();
    const refreshToken = user.signRefreshToken();
    res.status(200).json({
      status: "sucess",
      token,
      refreshToken,
    });
  }),
  protect: asyncHandle(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new errorResponse(401, "you are not login"));
    const encoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await users.findById(encoded.id);
    if (!currentUser) return next(new errorResponse(401, "user invalid"));
    req.user = currentUser;
    next();
  }),
  getMe: asyncHandle(async (req, res) => {
    const id = req.user.id;
    const user = await users.findById(id);
    if (!user) return next(new errorResponse(401, "user get me invalid"));
    res.status(200).json({
      status: "sucess",
      data: user,
    });
  }),
  restrictTo: (...role) => {
    return (req, res, next) => {
      if (!role.includes(req.user.role))
        return next(new errorResponse(403, "deny mission"));
      next();
    };
  },
  accessTokenRefresh: asyncHandle(async (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken)
      return next(new errorResponse(403, "refresh token invalid"));
    const encoded = await jwt.verify(refreshToken, process.env.JWT_SECRET);
    const refreshTokenRedis = await promisify(clientRedis.get).bind(clientRedis)(encoded.id);
    if (refreshToken !== refreshTokenRedis)
      return next(new errorResponse(401, "refreshToken invalid"));
    const user = await users.findById(encoded.id);
    if (!user) return next(new errorResponse(401, "user invalid"));
    const token = user.signToken();
    res.status(200).json({
      status: "sucess",
      token,
    });
  }),
};
