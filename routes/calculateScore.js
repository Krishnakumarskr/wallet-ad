const express = require("express");
const router = express.Router();

const { Network, Alchemy} = require('alchemy-sdk');
const Web3 = require('web3');
const ABI = require('../utils/ERC721ABI');
const CollectionTire = require("../models/CollectionTire");
const CollectionHolders = require("../models/CollectionHolders");

const PushAPI =  require("@pushprotocol/restapi");
const ethers = require("ethers");


const web3 = new Web3(process.env.ALCHEMY_MAINNET);
const sdk = require('api')('@nftgo/v2.0#3ov80nlb4veirz');

const PK = process.env.CHANNEL_PRIVATE_KEY; // channel private key
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

const settings = {
    apiKey: process.env.ALCHEMY_API, // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);



const getAllNFTs = async(wallet) => {
    const res = await alchemy.nft.getNftsForOwner(wallet, { filters:["SPAM", "AIRDROPS"]});
    return res.ownedNfts;
}

function getTimestampInSeconds () {
    return Math.floor(Date.now() / 1000)
}

const calculateNoOfDaysHeld = async(wallet, nft) => {

    return new Promise((res, rej) => {
        const contractAddress = nft.contract.address;
        console.log(nft);
        const contract = new web3.eth.Contract(ABI, contractAddress);
        console.log(contractAddress, )
        contract.getPastEvents('Transfer', {
            filter: { to: wallet},
            fromBlock: '0',
            toBlock: 'latest'
        }).then(async(e) => {
            const blockNumber = e[e.length - 1].blockNumber;
            const blockData = await web3.eth.getBlock(blockNumber);
            const difference = getTimestampInSeconds() - parseInt(blockData.timestamp);
            const days = Math.floor(difference / (3600 * 24));
            console.log(days);
            res(days);
        });
    });
}

const calculateDiamondHand = async(nfts) => {

}

const getcollectionHolders = async(tags) => {
    const holders = await CollectionHolders.find({category: tags}).distinct("address");
    return holders;
}

router.get('/score/:wallet', async(req, res) => {
    const { wallet } = req.params;

    const nfts = await getAllNFTs(wallet);
    console.log(nfts.length);
    let count = 0;
    let index = null;
    for(let i = 0; i< nfts.length; i++) {
        if(nfts[i].contract.address === '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d' && count === 0) {
            console.log('its erc721');
            const days = await calculateNoOfDaysHeld(wallet, nfts[i])
            count++;
            nfts[i]['daysHeld'] = days;
            index = i;
        } 
    }

});

router.get('/getHoldersByTag/:tag', async(req, res) => {
    try {
        const { tag } = req.params;

        const holders = await getcollectionHolders(tag);

        return res.status(200).json({holders: holders})
    } catch(e) {
        return res.status(500).json(e);
    }
    
});

router.post('/sendNotification', async(req, res) => {
    try {
        const { title, body, cta } = req.body;
        const apiResponse = await PushAPI.payloads.sendNotification({
          signer,
          type: 4, // target
          identityType: 2, // direct payload
          notification: {
            title: title,
            body: body,
            cta: cta
          },
          payload: {
            title: title,
            body: body,
            cta: cta,
            img: ''
          },
          recipients: ['eip155:5:0x1f5d944cF67D7D18B93fe38a85D4a2efD30d8F6F', 'eip155:5:0x0E5F2Bf569EF21078e1DB62fD36039B761b9fdd4'], // recipient address
          channel: 'eip155:5:0x1f5d944cF67D7D18B93fe38a85D4a2efD30d8F6F', // your channel address
          env: 'staging'
        });
        
        if(apiResponse?.status === 204) {
            res.status(200).json({status: true})
        }
        
      } catch (err) {
        console.error('Error: ', err);
      }
    
});



module.exports = router;