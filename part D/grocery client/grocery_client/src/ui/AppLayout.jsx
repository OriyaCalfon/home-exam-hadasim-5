import React from 'react'
import { Outlet } from 'react-router-dom'
import logo from '../assets/images/logo.png';
import './../index.css'

function AppLayout() {


    return (
        <div className="grid">
            <main className='main'>
                <img className="logo" src={logo} alt="logo" />
                <Outlet />
            </main>
            <footer className="footer"></footer>
        </div>
    )
}

export default AppLayout