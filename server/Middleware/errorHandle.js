const error = require("../helpers/ErrorResponse");

function errorHandle(err, req, res) {
  console.log(`Đã bắt lỗi: `, err.message);
  const error = err;
  res.json({
    status: "fail",
    message: err,
  });
}
module.exports = errorHandle;
