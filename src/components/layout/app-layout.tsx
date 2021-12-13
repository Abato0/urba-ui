
import React from 'react';
import NavBar from './app-bar';



const AppLayout: React.FC =({children})=>{
    return <NavBar>{children}</NavBar>
}

export default AppLayout