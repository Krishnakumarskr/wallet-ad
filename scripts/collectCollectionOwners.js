const fs = require("fs");
const { parse } = require("csv-parse");
const path = require('path');
const Collection = require('../models/Collections');
const Wallets = require('../models/Wallets');
const connectDB = require("../config/Database");

const { Network, Alchemy} = require('alchemy-sdk');

const settings = {
    apiKey: process.env.ALCHEMY_API, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const initAllCalls = async() => {
    //updateCollectionToDB();
    fetchOwners();
}


const updateCollectionToDB = async() => {
    let collectionDataSet = [];
    fs.createReadStream(path.join(__dirname, "collection-data.csv"))
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            const data = { address: row[0], category: row[1].split(',').map((i) => i.trim())}
            collectionDataSet.push(data);
        })
        .on("end", function () {
            Collection.insertMany(collectionDataSet).then(() => console.log('All records inserted!'));
        })
        .on("error", function (error) {
            console.log(error.message);
        });
}

const fetchOwners = async() => {
    const collections = await Collection.find({"status.owners" : {"$ne": true}});

    const wallets = await Wallets.find({},{address: 1, _id:0});
    let tempWallets = [];
    wallets.forEach(i => tempWallets.push(i.address));
    let localOwners = [];
    let to = collections.length >= 5 ? 5 : collections.length;
    for(let i = 0; i < to; i++) {
        const res = await alchemy.nft
            .getOwnersForContract(collections[i].address)
        
        localOwners = [...new Set([...localOwners, ...res.owners])]
    }

    const newOwners = localOwners.filter(x => !tempWallets.includes(x));

    console.log(newOwners.length);

    // const data = [];
    // newOwners.forEach(item => data.push({address: item}));
    // console.log(data.length);

    // if(data.length > 0) {
    //     Wallets.insertMany(data).then(() => console.log('All addresses inserted!'));
    // }
    //  else {
    //     console.log('nothing to insert!')
    // }
    
}


connectDB().then(initAllCalls)



