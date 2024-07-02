import { App } from '../types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

import { SysInfo } from './sys-info/sys-info';
import { Settings } from './settings/settings';

export const PageView = () => {
    return (
        <section className='page-view'>
            <SysInfo/>
            <Settings/>
        </section>
    )
}