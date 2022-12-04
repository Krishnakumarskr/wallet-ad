const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CollectionsTireSchema = new Schema({
	nftCollection:{
        type: Object
	}
},{
    timestamps: true
});

const CollectionTire = mongoose.model('CollectionTire', CollectionsTireSchema);

module.exports = CollectionTire;