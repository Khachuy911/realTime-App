const userRouter = require("./userRoute");
const errorHandle = require("../Middleware/errorHandle");
function router(app) {
  app.use("/api/v1/user", userRouter);
  app.use(errorHandle);
}

module.exports = router;
