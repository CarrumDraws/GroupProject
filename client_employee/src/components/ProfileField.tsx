import { Box, Typography, TextField } from '@mui/material';
import { formatDate } from '../utils/utilMethods.tsx';

interface ProfileFieldProps {
    label: string;
    type: string;
    name: string;
    value: any;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editMode: boolean;
}

const textFieldStyle = {
    sx: {
        height: '1.5rem',
        ml: '0.5rem',
        '& input': {
            height: '1.5rem',
            padding: '0 0.5rem'
        },
        border: '0.5px solid #9EAABA'
    }
};

const ProfileField: React.FC<ProfileFieldProps> = ({ label, type, name, value, onChange, editMode }) => {
    return (
        <Box paddingBottom='0.5rem' sx={{ display: 'flex', flexDirection: 'row' }}>
            <Typography>{label}: </Typography>
            {editMode ? (
                <TextField type={type} name={name} value={value} onChange={onChange} InputProps={textFieldStyle} />
            ) : (
                <Typography paddingLeft='0.5rem'>
                    {type === 'date' ? formatDate(value, '/') : value}
                </Typography>
            )}
        </Box>
    );
};

export default ProfileField;