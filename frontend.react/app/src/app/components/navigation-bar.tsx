'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationBar() {
    return (<div>{usePathname()}</div>)
}