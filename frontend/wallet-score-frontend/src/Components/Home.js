import Web3 from 'web3';
import { createContext, useContext, useEffect, useState } from "react";


const Home = () => {
    const [inputWallet, setInputWallet] = useState(null);

    const getScore = async() => {
        console.log(inputWallet.trim());
    }
    return <div className="mt-[10%]">
       <input type="text" placeholder='Enter wallet address' className='pl-2 ml-4 border border-blue-500 rounded-lg h-[50px] w-[600px]' onChange={(e) => setInputWallet(e.target.value)} />

       <br />

       <button onClick={getScore} className='mt-4 py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'>Score</button>
    </div>
}

export default Home;