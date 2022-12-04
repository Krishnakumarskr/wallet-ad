
import './App.css';
import GlobalContextProvider, { useGCtx } from './GlobalContext';
import RoutesComp from './Components/RoutesComp';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import Web3Modal from "web3modal";

function App() {

  const Navbar = () => {

    const {wallet, setWallet} = useGCtx();
    const navigate = useNavigate();

    const connectWallet = async() => {
        const providerOptions = {
            /* See Provider Options Section */
          };
          
          const web3Modal = new Web3Modal({
            cacheProvider: true, // optional
            providerOptions // required
          });
          
          const provider = await web3Modal.connect();
          
          const web3 = new Web3(provider);
    }
    return(

        <nav class="Vdark-2 shadow-xl">
            <div class="container mx-28 ">
                <div class="relative flex items-center h-16 justify-between">
                <div class="Vwhite-text text-4xl ml-10 myfont text-left">Wallet Score</div>

                <div class="text-right">
                    <span onClick={() => navigate('/')} class="Vwhite-text text-xl myfont mx-10">Home</span>
                    {/* <span onClick={() =>navigate('/search')} class="Vwhite-text text-xl myfont mx-10">Search</span> */}
                </div>
                <div className='text-right'>
                        <button className='py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
                            onClick={connectWallet}
                        >Connect wallet</button>

                </div>
                </div>
            </div>
        </nav>
    );

  }

  const Buttonconnect = () => {
    const { wallet, setWallet } = useGCtx();

    const connectWallet = async() => {
      console.log(wallet);
      await setWallet('test string')
      console.log(wallet);
    }
    return <button onClick={connectWallet}>connect</button>

  };

  return (
    <Router>
    <GlobalContextProvider >
        <Navbar />
        <div className="App">
          <RoutesComp></RoutesComp>
        </div>     

    </GlobalContextProvider>
    </Router>

  );
}

export default App;
