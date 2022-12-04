const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CollectionHoldersSchema = new Schema({
	address:{
		type: String,
		required: true,
	},
    category: {
        type: Array
    },
    collectionAddress: {
        type: Array
    }
},{
    timestamps: true
});

const CollectionHolders = mongoose.model('CollectionHolders', CollectionHoldersSchema);

module.exports = CollectionHolders;