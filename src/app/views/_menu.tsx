import { App } from '../types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';
import { Drawer, Divider, List } from '@mui/material';

export const NavMenu = () => {
    return (
        <List className='menu'
        >
            <h2>Menu goes here</h2>
            <Divider/>
        </List>
    )
}