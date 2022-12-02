const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
	address:{
		type: String,
		required: true,
        index: true
	}
},{
    timestamps: true
});

const Wallets = mongoose.model('Wallets', WalletSchema);

module.exports = Wallets;