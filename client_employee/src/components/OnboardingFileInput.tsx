import { Box, SxProps, Theme, Typography } from "@mui/material";

interface OnboardingFileInputProps{
    boxStyle: SxProps<Theme> | undefined;
    titleStyle: {};
    title: string;
    name: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isDisabled: boolean;
}

const OnboardingFileInput: React.FC<OnboardingFileInputProps> = ({ boxStyle, titleStyle, title, name, onChange, isDisabled }) => {
    return (
        <Box sx={boxStyle}>
            <Typography sx={titleStyle}>
                {title}
            </Typography>
                <input type='file' name={name} onChange={onChange} disabled={isDisabled} />
        </Box>
    );
}

export default OnboardingFileInput;