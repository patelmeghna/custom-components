import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const TableLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default TableLayout