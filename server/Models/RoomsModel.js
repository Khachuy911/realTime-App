const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name:{
		type:String,
		require:[true,"empty name"]
	},
	password:{
		type:String,
		require:[true,"empty password"]
	},
	user:{
		id:mongoose.SchemaTypes.ObjectId,
		ref:user,
	},
},{
	timestamps:true,
});

module.exports = mongoose.model("room", roomSchema);