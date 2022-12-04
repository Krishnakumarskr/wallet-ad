const fs = require("fs");
const { parse } = require("csv-parse");
const path = require('path');
const Collection = require('../models/Collections');
const PFP = require('../models/PFP');
const CollectionTire = require('../models/CollectionTire');
const connectDB = require("../config/Database");

const { Network, Alchemy} = require('alchemy-sdk');
const CollectionHolders = require("../models/CollectionHolders");
const { forEach } = require("../utils/ERC721ABI");
const Bluechips = require("../models/BlueChipMaxis");



const settings = {
    apiKey: process.env.ALCHEMY_API, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

const alchemy1 = new Alchemy({
    apiKey: process.env.ALCHEMY_API_1, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET,
});

const alchemy2 = new Alchemy({
    apiKey: process.env.ALCHEMY_API_2, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET,
})

const alchemy3 = new Alchemy({
    apiKey: process.env.ALCHEMY_API_3, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET,
})

const alchemy4 = new Alchemy({
    apiKey: process.env.ALCHEMY_API_4, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET,
})

const alchemy5 = new Alchemy({
    apiKey: process.env.ALCHEMY_API_5, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET,
})

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const initAllCalls = async() => {
    //// -------- DONOT UNCOMMENT ---------//
    //updateCollectionToDB();
    //fetchOwners();
    //updateCollectionTire();
    //classifyCollectionTires();
    //getCategory();
    //getCollectionHolders();
    //revertOwners();
    //removeDupes();
    blueChipMaxis();



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
    const wallets = await PFP.find({},{address: 1, _id:0});
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

    const data = [];
    newOwners.forEach(item => data.push({address: item}));
    console.log(data.length);

    if(data.length > 0) {
        PFP.insertMany(data).then(async() => {
            console.log('All addresses inserted!');
            await Collection.findOneAndUpdate({"status.owners": {"$ne": true}}, {"status.owners": true})
        });
    }
     else {
        console.log('nothing to insert!')
    }
    
}

const updateCollectionTire = async() => {
    const sdk = require('api')('@nftgo/v2.0#3ov80nlb4veirz');

    sdk.auth(process.env.NFTGO_API);
    let collectionArray = [];
    for(let i = 0; i <= 80; i++) {
        const res = await sdk.get_collection_ranking_eth_v1_market_rank_collection__time_range__get({
            by: 'volume',
            with_rarity: 'false',
            asc: 'false',
            offset: `${i}`,
            limit: '50',
            time_range: '30d'
        });

        res.data.collections.forEach(item => collectionArray.push({nftCollection: item}));
        await delay(200);

    }

    await CollectionTire.insertMany(collectionArray);

    console.log(collectionArray.length)
}

const classifyCollectionTires = async() => {
    await CollectionTire.updateMany({"nftCollection.market_cap_usd" : {$gte : 100000000}}, {"nftCollection.tire" : 1});
}

const getCategory = async() => {
    const res = await CollectionTire.distinct("nftCollection.categories");

    console.log(res);
}

const getCollectionHolders = async() => {
    const getCollectionAddresses = [
       "0x78a3b30f90f9a39272c1cb3e558fcd1cbe5fb791",
    ];


    for(let i = 0; i < getCollectionAddresses.length; i++) {
        const collections = await CollectionTire.findOne({"nftCollection.contracts": getCollectionAddresses[i]});
    


        const contractAddresses = collections.nftCollection.contracts;

        for(let j = 0; j < contractAddresses.length; j++) {
            let insertQueries = [];
            const res = await alchemy.nft
                .getOwnersForContract(contractAddresses[j]);
            const collectionCategory = collections.nftCollection.categories;

            res.owners.forEach((item) => {
                let iq = {
                    address: item,
                    category: collectionCategory,
                    collectionAddress: [contractAddresses[j]]
                }

                insertQueries.push(iq);
            });

            console.log('Insert Queries', insertQueries.length);

            if(insertQueries.length > 0) {
                await CollectionHolders.insertMany(insertQueries);
                insertQueries = []
            }

            console.log(`updated for ${contractAddresses[j]}.....${i}!`);
        }


    };

}



const revertOwners = async() => {
    await CollectionTire.updateMany({"nftCollection.owners": true}, {"nftCollection.owners": false});
}

const removeDupes = async() => {
    CollectionTire.ensureIndexes({"nftCollection.name": 1}, {unique: true, dropDups: true}).then((res) => console.log('Droped!'));
}


const blueChipMaxis = async() => {

    const blueChipNFTs = [
        "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d", //BAYC
        "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb", //Cryptopunk
        "0x60e4d786628fea6478f785a6d7e704777c86a7c6", //MAYC
        "0xed5af388653567af2f388e6224dc7c4b3241c544", //Azuki
        "0x23581767a106ae21c074b2276d25e5c3e136a68b", //Moonbird
        "0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b" //Clone -X
    ];

    const holders = await CollectionHolders.find({collectionAddress: {$in: blueChipNFTs}}).distinct('address');

    const bluechipHolders = await Bluechips.find({}, {address: 1, _id: 0});
    let tempWallets = [];
    bluechipHolders.forEach(i => tempWallets.push(i.address));


    let actualHolders = holders.filter(i => !tempWallets.includes(i));
    console.log(actualHolders.length);

    for(let j = 0; j < 1000; j++) {
        const nfts = await alchemy.nft.getNftsForOwner(actualHolders[j], {contractAddresses: blueChipNFTs})

        let score = 0;
        let count = {}
        for(let i = 0; i < nfts.ownedNfts.length; i++) {

            let nft = nfts.ownedNfts[i];

            //BAYC
            if(nft.contract.address === blueChipNFTs[0]) {
                score += (100 * 7.5);
                count[blueChipNFTs[0]] === undefined ? count[blueChipNFTs[0]] = 1 : count[blueChipNFTs[0]] += 1
            }

            //Cryptopunk
            if(nft.contract.address === blueChipNFTs[1]) {
                score += (95 * 7.5);
                count[blueChipNFTs[1]] === undefined ? count[blueChipNFTs[1]] = 1 : count[blueChipNFTs[1]] += 1
            }

            //MAYC
            if(nft.contract.address === blueChipNFTs[2]) {
                score += (33 * 5);
                count[blueChipNFTs[2]] === undefined ? count[blueChipNFTs[2]] = 1 : count[blueChipNFTs[2]] += 1
            }

            //Azuki
            if(nft.contract.address === blueChipNFTs[3]) {
                score += (28 * 7.5);
                count[blueChipNFTs[3]] === undefined ? count[blueChipNFTs[3]] = 1 : count[blueChipNFTs[3]] += 1
            }

            //Moonbird
            if(nft.contract.address === blueChipNFTs[4]) {
                score += (23 * 7.5);
                count[blueChipNFTs[4]] === undefined ? count[blueChipNFTs[4]] = 1 : count[blueChipNFTs[4]] += 1
            }

            //CloneX
            if(nft.contract.address === blueChipNFTs[5]) {
                score += (18 * 3.5);
                count[blueChipNFTs[5]] === undefined ? count[blueChipNFTs[5]] = 1 : count[blueChipNFTs[5]] += 1
            }
        }

        Bluechips.insertMany({address: actualHolders[j], score: score, counts: count}).then(() => console.log(`Completed - ${j}`));
    }

}


connectDB().then(initAllCalls)
