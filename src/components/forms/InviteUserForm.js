import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Button, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

const groupNames = [
    'developers',
    'users'
];

export default ({ onInvite }) => {
    const [groups, setGroups] = React.useState([]);
    const [username, setUsername] = useState('')
    const onInviteHandler = () => {
        onInvite(
            {
                "name": username,
                groups,
                "role": "user",
                "privileges": []
            }
        )
        setGroups([])
        setUsername('')
    }
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setGroups(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    return (
        <Grid container
            direction="row"
            alignItems="center"
            spacing={2}
        >
            <Grid item xs={5}>
                <TextField fullWidth label="Username" variant="outlined" value={username} onChange={e => {
                    setUsername(e.target.value)
                }} />
            </Grid>
            <Grid item xs={5}>
                <FormControl sx={{ width: '100%' }}>
                    <InputLabel id="demo-multiple-chip-label">Groups</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={groups}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                        renderValue={(selected) => (
                            <Box>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {groupNames.map((groupName) => (
                            <MenuItem
                                key={groupName}
                                value={groupName}
                            >
                                {groupName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={2}>
                <Button disabled={username.length === 0} endIcon={<SendIcon />} style={{ width: '100%' }} variant="outlined" onClick={onInviteHandler}>Invite</Button>
            </Grid>
        </Grid >
    )
}