const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CollectionsSchema = new Schema({
	address:{
		type: String,
		required: true,
        index: true
	},

    category: {
        type: Array
    },

    status: {
        type: Object
    }
},{
    timestamps: true
});

const Collection = mongoose.model('Collections', CollectionsSchema);

module.exports = Collection;