const users = require("../Models/UsersModel");
const asyncHandle = require("../Middleware/asyncHandle");
const errorResponse = require("../helpers/ErrorResponse");
module.exports = {
  getUser: asyncHandle(async (req, res) => {
    const user = await users.findById(req.params.id);
    if (!user) return next(new errorResponse(401, "user not exists"));
    res.status(200).json({
      status: "sucess",
      data: user,
    });
  }),
  getAllUser: asyncHandle(async (req, res) => {
    const user = await users.find();
    if (!user) return next(new errorResponse(401, "user not exists"));
    res.status(200).json({
      status: "sucess",
      data: user,
    });
  }),
  updateUser: asyncHandle(async (req, res) => {
    const updateUser = req.body;
    const user = await users.findByIdAndUpdate(req.params.id, updateUser);
    if (!user) return next(new errorResponse(401, "user not exists"));
    res.status(200).json({
      status: "sucess",
      data: "update sucessfully",
    });
  }),
  deleteUser: asyncHandle(async (req, res) => {
    const user = await users.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "sucess",
      data: {},
    });
  }),
};
