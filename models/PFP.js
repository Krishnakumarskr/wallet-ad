const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PFPSchema = new Schema({
	address:{
		type: String,
		required: true,
	}
},{
    timestamps: true
});

const PFP = mongoose.model('Wallets', PFPSchema);

module.exports = PFP;