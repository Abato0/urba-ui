
import React from 'react';
import SideBar from './app-sidebar';
import { AppBar } from '@material-ui/core';
import NavBar from './app-bar';



const AppLayout: React.FC =({children})=>{
    return <NavBar><SideBar>{children}</SideBar></NavBar>
}

export default AppLayout