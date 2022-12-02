import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import Web3Modal from "web3modal";


const GlobalContext = createContext({});

export function useGCtx() {
    return useContext(GlobalContext);
}

export default function GlobalContextProvider({ children }) {
    const [wallet, setWallet] = useState(null);

    return <GlobalContext.Provider value={{
        wallet,
        setWallet
    }} >
        {children}
    </GlobalContext.Provider>
}