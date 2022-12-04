const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BlueChipSchema = new Schema({
	address:{
		type: String,
		required: true,
        unique: true,
	},
    score: {
        type: Number
    },
    counts: {
        type: Object
    }
},{
    timestamps: true
});

const Bluechips = mongoose.model('Bluechips', BlueChipSchema);

module.exports = Bluechips;