import { App, UserSettings, SupportedImage, supportedImages } from '../types';
import { FormGroup, FormControlLabel, Switch, Accordion, AccordionSummary,
AccordionDetails, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

const Format = (props: {active: boolean, type: SupportedImage, setType: Dispatch<SupportedImage>}) => {
    const isSupportedImage = (x: any): x is SupportedImage => supportedImages.includes(x);
    const HandleTypeChange = (type: string) => {
        if (isSupportedImage(type)) {
            props.setType(type as SupportedImage);
        }
    }
    return (
        <FormControl disabled={!props.active} fullWidth>
            <InputLabel id="demo-simple-select-label">Format</InputLabel>
            <Select
                value={props.type}
                label="Format"
                onChange={(e) => HandleTypeChange(e.target.value)}
            >
                <MenuItem value={'image/webp'}>WebP</MenuItem>
                <MenuItem value={'image/jpeg'}>JPEG</MenuItem>
                <MenuItem value={'image/png'}>PNG</MenuItem>
                <MenuItem value={'*/*'}>Smallest</MenuItem>
            </Select>
        </FormControl>
    )
}

export const Convert = () => {
    const [active, setActive]: [boolean, Dispatch<boolean>] = useState<boolean>(false);
    const [preserveBg, setPreserveBg]: [boolean, Dispatch<boolean>] = useState<boolean>(false);
    const [type, setType]: [SupportedImage, Dispatch<SupportedImage>] = useState<SupportedImage>("*/*");
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}
            aria-controls="conver1-content"
            id="convert1-header">Convert</AccordionSummary>
            <AccordionDetails id='conver1-content'>
                <ul className='settings-list'>
                    <li className="settings-list__item">
                        <FormGroup>
                            <FormControlLabel labelPlacement='start' control={
                                <Switch checked={active} onChange={() => setActive(!active)} />
                            } label="Convert images to another format" />
                        </FormGroup>
                    </li>
                    <li className="settings-list__item">
                        <Format active={active} type={type} setType={setType}/>
                    </li>
                    <li className="settings-list__item">
                    <FormGroup>
                            <FormControlLabel labelPlacement='start' control={
                                <Switch disabled={!active} checked={preserveBg} onChange={() => setPreserveBg(!preserveBg)} />
                            } label="Preserve transparent backgrounds" />
                        </FormGroup>
                    </li>
                </ul>
            </AccordionDetails>
        </Accordion>
    )
}