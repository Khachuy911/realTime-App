const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const textSchema = new Schema(
  {
    text: {
      type: String,
      require: [true, "empty text"],
    },
    user: {
      id: mongoose.SchemaTypes.ObjectId,
      ref: user,
    },
    room: {
      id: mongoose.SchemaTypes.ObjectId,
      ref: room,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("text", textSchema);
