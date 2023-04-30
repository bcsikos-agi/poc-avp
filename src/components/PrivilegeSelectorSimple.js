import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel, FormGroup } from '@mui/material';

export default ({ actions, selected, onChange, groups }) => {
    const [userPrivs, setUserPrivs] = useState([])
    const [mySelected, setMySelected] = useState([])

    useEffect(() => {
        setMySelected(selected.privileges)
    }, [selected])

    useEffect(() => {
        let groupsMap = groups.reduce((map, obj) => {
            map[obj.name] = obj.privileges
            return map
        }, {})
        let allowedByGroup = new Set(
            selected.groups
                .flatMap(userGroup => {
                    return groupsMap[userGroup]
                })
        )
        let allowedByAttributes = new Set(
            mySelected
        )
        let allowed = new Set([...allowedByAttributes, ...allowedByGroup])
        setUserPrivs(actions.map(action => {
            return {
                name: action.name,
                active: allowed.has(action.name)
            }
        }))
        onChange(mySelected)
    }, [mySelected, actions, groups])

    const handleChange = e => {
        let selectedPriv = e.target.labels[0].innerText
        if (e.target.checked) {
            setMySelected(prevSelected => [...prevSelected, selectedPriv])
        } else {
            setMySelected(prevSelected => prevSelected.filter(p => p !== selectedPriv))
        }
    }

    return (
        <FormGroup>
            {userPrivs && userPrivs.map((priv, index) =>
                <FormControlLabel key={index} control={
                    <Checkbox checked={priv.active} onChange={handleChange} />
                } label={priv.name} />
            )}
        </FormGroup>
    );
}