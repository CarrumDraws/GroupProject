import { TextField } from "@mui/material";

interface OnboardingFieldProps {
    isLong: boolean;
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isDisabled: boolean;
}

const textFieldStyleShort = {
    height: '2rem',
    '& input': {
        height: '1.5rem',
        padding: '0 0.5rem'
    },
    border: '0.5px solid #9EAABA'
};

const textFieldStyleLong = {
    height: '2rem',
    width: '39.5rem',
    '& input': {
        height: '1.5rem',
        padding: '0 0.5rem'
    },
    border: '0.5px solid #9EAABA'
};

const OnboardingField: React.FC<OnboardingFieldProps> = ({ isLong, label, type, name, value, onChange, isDisabled }) => {
    return (
        <TextField
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={label}
            InputProps={{
                style: isLong ? textFieldStyleLong : textFieldStyleShort,
                inputProps: {
                    style: {
                        textAlign: 'center',
                        marginRight: '0.5rem'
                    },
                }
            }}
            sx={{ mt: '1rem', mr: '0.5rem' }}
            disabled={isDisabled}
        />
    );
}

export default OnboardingField;