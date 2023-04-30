import React, { useEffect, useState } from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default ({ actions, resources, onDo, buttonActive }) => {
    const [action, setAction] = useState('')
    const [resource, setResource] = useState('')
    const [button, setButton] = useState(buttonActive)

    useEffect(() => {
        setButton(action.length === 0 || resource.length === 0)
    }, [action, resource])
    const handleActionChange = (event) => {
        setAction(event.target.value);
    };
    const handleResourceChange = (event) => {
        setResource(event.target.value);
    };
    return (
        <Grid container
            direction="row"
            alignItems='center'
            spacing={2}
            justifyContent='space-evenly'
        >
            <Grid item xs={6} >
                <FormControl variant="standard" sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="demo-simple-select-standard-label">Action</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={action}
                        onChange={handleActionChange}
                        label="Action"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {actions && actions.length > 0 && actions.map(action => <MenuItem key={action.name} value={action.name}>{action.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={1}>
                <Typography variant='h8' > on </Typography>
            </Grid>
            <Grid item xs={3} >
                <FormControl variant="standard" sx={{ m: 1 }} fullWidth>
                    <InputLabel id="demo-simple-select-standard-label">Resource</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={resource}
                        onChange={handleResourceChange}
                        label="Resource"
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {resources && resources.map(resource => <MenuItem key={resource.name} value={resource.name}>{resource.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2}>
                <Button
                    fullWidth
                    disabled={button}
                    endIcon={<SendIcon />}
                    style={{ height: '100%' }}
                    variant="outlined"
                    onClick={() => { onDo({ action, resource }) }}>Do it</Button>
            </Grid>
        </Grid >
    )
}