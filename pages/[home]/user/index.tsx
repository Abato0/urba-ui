import React from 'react'
import AppLayout from '../../../src/components/layout/app-layout';



const HomeUser: React.FC = ({children})=>{

    return <AppLayout>Hola Usuario{children}</AppLayout>
}


export default HomeUser