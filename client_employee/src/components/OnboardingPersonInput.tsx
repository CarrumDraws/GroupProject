import { Box, Button, SxProps, Theme, Typography } from "@mui/material";

import { Person } from './Person.tsx';
import OnboardingField from "./OnboardingField.tsx";

interface OnboardingPersonInputProps{
    boxRowStyle: SxProps<Theme> | undefined;
    boxColumnStyle: SxProps<Theme> | undefined;
    title: string;
    errors: string[];
    personArr: Person[];
    handleDelete:(p: Person) => void;
    currentPerson: Person;
    handlePersonChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isDisabled: boolean;
    handleAdd: () => void;
}

const OnboardingPersonInput : React.FC<OnboardingPersonInputProps> = ({
    boxRowStyle,
    boxColumnStyle,
    title,
    errors,
    personArr,
    handleDelete,
    currentPerson,
    handlePersonChange,
    isDisabled,
    handleAdd
}) => {
    const generateNameLabel = (field: string) => {
        switch (field.toLowerCase()) {
          case 'firstname':
            return 'First Name*';
          case 'middlename':
            return 'Middle Name';
          case 'lastname':
            return 'Last Name*';
          default:
            return '';
        }
    };
    
    return (
        <>
            <Typography
                display='flex'
                justifyContent='center'
                paddingTop='1.5rem'
                fontSize='1.5rem'
                color='#8696A7'
                sx={{ textDecoration: 'underline' }}
            >
                {title}
            </Typography>

            <Box sx={boxColumnStyle}>
                {errors.map((e) => (
                    <Typography color='red'>{e}</Typography>
                ))}
            </Box>

                <Box sx={boxRowStyle} paddingTop='0.5rem'>
                    {personArr.map((p) => (
                        <Box key={`${p.firstname}-${p.lastname}-${p.phone}`} sx={boxColumnStyle} paddingLeft='1.5rem' paddingRight='1.5rem'>
                            <Typography>{p.firstname} {p.middlename} {p.lastname} ({p.relationship}): </Typography>
                            <Typography>{p.phone}</Typography>
                            <Typography>{p.email}</Typography>
                            <Button sx={{ mt:0, paddingTop:0 }} onClick={() => handleDelete(p)}>Delete</Button>
                        </Box>
                    ))}
                </Box>
                <Box sx={boxColumnStyle}>
                    <Box sx={boxRowStyle}>
                        {(['firstname', 'middlename', 'lastname'] as const).map(field => (
                            <OnboardingField 
                                key={field} 
                                isLong={false} 
                                label={generateNameLabel(field)} 
                                type='text' 
                                name={field} 
                                value={currentPerson[field]} 
                                onChange={handlePersonChange} 
                                isDisabled={isDisabled} 
                            />
                        ))}
                    </Box>

                    <Box sx={boxRowStyle}>
                        {(['phone', 'email', 'relationship'] as const).map(field => (
                            <OnboardingField 
                                key={field} 
                                isLong={false} 
                                label={`${field.charAt(0).toUpperCase()}${field.slice(1)}*`} 
                                type='text' 
                                name={field} 
                                value={currentPerson[field]} 
                                onChange={handlePersonChange} 
                                isDisabled={isDisabled} 
                            />
                        ))}
                    </Box>

                    <Button onClick={handleAdd}>Save</Button>
                </Box>
        </>
    );
}

export default OnboardingPersonInput;