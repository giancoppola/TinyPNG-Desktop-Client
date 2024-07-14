import { App } from '../types';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

import { Settings } from './settings/settings';
import { ImgCompress } from './img-compress/img-compress';

export const PageView = () => {
    return (
        <section className='page-view'>
            <ImgCompress/>
            <Settings/>
        </section>
    )
}