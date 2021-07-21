const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientRedis = require("../Config/redis");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "email already exists"],
      require: [true, "empty email"],
    },
    phone: {
      type: String,
      require: [true, "empty phone number"],
    },
    name: {
      type: String,
      require: [true, "empty name"],
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
      require: [true, "empty password"],
      select: true,
    },
    confirmPassword: {
      type: String,
      require: [true, "empty password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "password are not the same !",
      },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});
userSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
userSchema.methods.matchPassword = (password, passwordHasher) => {
  return bcrypt.compare(password, passwordHasher);
};
userSchema.methods.signRefreshToken = function () {
  const refreshToken = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });
  clientRedis.set(`${this._id}`, refreshToken, (err, val) => {
    console.log(err);
  });
  return refreshToken;
};


module.exports = mongoose.model("user", userSchema);
