const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	email : { type : String, required : true, unique : true,
		match : /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ 
	},
	password : { type : String, required : true}
});

module.exports = mongoose.model('User', userSchema);