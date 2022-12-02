import  { useGCtx } from '../GlobalContext';
import { Route, Routes, Router,  useLocation } from "react-router-dom";

import Home from './Home';
import Dashboard from './Dashboard';





const RoutesComp = () => {
    const location = useLocation();
    return <>
    <Routes location={location}>
        <Route path="/" exact element={<Home />} />
        <Route path="/dashboard" exact element={<Dashboard />} />
    </Routes>
   
       
    </>
}

export default RoutesComp;