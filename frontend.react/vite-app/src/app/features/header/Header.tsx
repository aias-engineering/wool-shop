import React from 'react'
import reactLogo from '../../assets/react.svg'
import viteLogo from '/vite.svg'
import './header.css'

export default function Header() {
    return (
        <>
            <div className="main">
                <img src={viteLogo} className="logo" alt="Vite logo" />
                <img src={reactLogo} className="logo react" alt="React logo" />
                <h1>Naqab Bedouin Design</h1>
            </div>
        </>)
}