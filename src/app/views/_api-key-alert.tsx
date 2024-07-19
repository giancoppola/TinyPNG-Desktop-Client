import { App, UserSettings, SupportedImage, supportedImages } from '../types';
import { FormGroup, FormControlLabel, Switch, Accordion, AccordionSummary,
AccordionDetails, FormControl, InputLabel, Select, MenuItem, TextField, 
InputAdornment} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { SetStateAction, useEffect, useState, Dispatch } from 'react';

const ApiKeyAlert = () => {
    const [apiKey, setApiKey]: [string, Dispatch<string>] = useState<string>("");
    
}