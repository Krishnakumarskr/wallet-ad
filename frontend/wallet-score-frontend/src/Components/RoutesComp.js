import  { useGCtx } from '../GlobalContext';
import { Route, Routes, Router,  useLocation } from "react-router-dom";

import Home from './Home';
import Search from './Search';





const RoutesComp = () => {
    const location = useLocation();
    return <>
    <Routes location={location}>
        <Route path="/" exact element={<Home />} />
        <Route path="/search" exact element={<Search />} />
    </Routes>
   
       
    </>
}

export default RoutesComp;