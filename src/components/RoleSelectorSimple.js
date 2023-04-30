import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
    ({ theme, checked }) => ({
        '.MuiFormControlLabel-label': checked && {
            color: theme.palette.primary.main,
        },
    }),
);

function MyFormControlLabel(props) {
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
        checked = radioGroup.value === props.value;
    }

    return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
    /**
     * The value of the component.
     */
    value: PropTypes.any,
};

export default function RoleSelectorSimple({ selected, onChange, roles }) {
    const [value, setValue] = React.useState(selected)
    React.useEffect(() => {
        setValue(selected)
    }, [selected])
    const handleChange = e => {
        setValue(e.target.value)
        onChange(value)
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return (
        <RadioGroup name="use-radio-group" value={value} onChange={handleChange}>
            {roles.map(role => <MyFormControlLabel key={role.name} value={role.name} label={capitalizeFirstLetter(role.name)} control={<Radio />} />)}
        </RadioGroup>
    );
}