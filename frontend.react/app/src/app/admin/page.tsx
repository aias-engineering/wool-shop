import Link from 'next/link'
import React from 'react';
import NavigationBar from '../components/navigation-bar';

export default function Page() {
    return (
        <div>
            <header><NavigationBar></NavigationBar></header>
            <h1>Admin Page</h1>
            <ul>
                <li><Link href={'/admin/products'}>Products</Link></li>
            </ul>
        </div>);
}