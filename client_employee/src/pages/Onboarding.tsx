import { useState, useEffect } from 'react';
import axios from 'axios';

import { Box, TextField, Button, Container, Typography, Select, MenuItem, InputLabel } from '@mui/material';

interface OnboardingProps {
    initialStatus: string;
}

const Onboarding: React.FC<OnboardingProps> = ({ initialStatus }) => {
    const [onboardingStatus, setOnboardingStatus] = useState<string>(initialStatus);
    const [feedback, setFeedback] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        preferredName: '',
        picture: '',
        buildAptNum: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        cell: '',
        work: '',
        make: '',
        model: '',
        color: '',
        email: '', // delete?
        ssn: '',
        dob: '',
        gender: '',
        citizenshipType: '',
        workAuth: '',
        optReciept: '',
        title: '',
        startDate: '',
        endDate: '',
        hasLicense: false,
        licenseNumber: '',
        expDate: '',
        license: '',
        references: {},
        contacts: {},
        uploadedFiles: []
    });

    useEffect(() => {
        if(onboardingStatus === 'Rejected') {
            // fetch feedback then set it
        }
    }, [onboardingStatus]);

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // submit form to server
        
        setOnboardingStatus('Pending');
    }

    return (
        <Container>
            <form>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField>First Name*</TextField>
                    <TextField>Middle Name</TextField>
                    <TextField>Last Name*</TextField>
                </Box>
                <TextField>Preferred Name</TextField>

                <Typography>Choose Profile Picture</Typography>
                <input type='file' />

                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField>Building/Apt # *</TextField>
                    <TextField>Street Name*</TextField>
                    <TextField>City*</TextField>
                    <TextField>State*</TextField>
                    <TextField>Zip*</TextField>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField>Cell Phone</TextField>
                    <TextField>Work Phone</TextField>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField>Car Make</TextField>
                    <TextField>Car Model</TextField>
                    <TextField>Car Color</TextField>
                </Box>

                <Typography>Email</Typography>

                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <TextField>SSN</TextField>
                    <TextField>Date of Birth</TextField>
                    
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                        labelId='gender-label'
                    >
                        <MenuItem>Male</MenuItem>
                        <MenuItem>Female</MenuItem>
                        <MenuItem>I do not wish to answer</MenuItem>
                    </Select>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <InputLabel id="citizenship-label">
                        Are you a citizen or permanent resident of the U.S?
                    </InputLabel>
                    <Select
                        labelId='citizenship-label'
                    >
                        <MenuItem>Yes</MenuItem>
                        <MenuItem>No</MenuItem>
                    </Select>
                </Box>

                { true ?
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <InputLabel id="citizen-label">Select Type: </InputLabel>
                        <Select
                            labelId='citizen-label'
                        >
                            <MenuItem>Green Card</MenuItem>
                            <MenuItem>Citizen</MenuItem>
                        </Select>
                    </Box> :
                    <Box>
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <InputLabel id="workauth-label">What is your work authorization?</InputLabel>
                            <Select
                                labelId='workauth-label'
                            >
                                <MenuItem>H1-B</MenuItem>
                                <MenuItem>L2</MenuItem>
                                <MenuItem>F1(CPT/OPT)</MenuItem>
                                <MenuItem>H4</MenuItem>
                                <MenuItem>Other</MenuItem>
                            </Select>
                        </Box>

                        { true ?
                            <Box>
                                <Typography>Upload OPT Reciept</Typography>
                                <input type='file' />
                            </Box> :
                            <Box>
                                <TextField>Title</TextField>
                            </Box>
                        }

                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <TextField type='date'>Start Date</TextField>
                            <TextField type='date'>End Date</TextField>
                        </Box>
                    </Box>
                }

                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <InputLabel id="license-label">Do you have a driver's license?</InputLabel>
                    <Select
                        labelId='license-label'
                    >
                        <MenuItem>Yes</MenuItem>
                        <MenuItem>No</MenuItem>
                    </Select>
                </Box>

                { true ?
                    <Box>
                        <Box sx={{display: 'flex', flexDirection: 'row'}}>
                            <TextField>License Number</TextField>
                            <TextField>Expiration Date</TextField>
                        </Box>

                        <Typography>Please upload a copy of your license</Typography>
                        <input type='file' />
                    </Box> :
                    <></>
                }

                <Typography>Reference</Typography>
                <Box></Box>
                <Box>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <TextField>First Name*</TextField>
                        <TextField>Middle Name</TextField>
                        <TextField>Last Name*</TextField>
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <TextField>Phone*</TextField>
                        <TextField>Email*</TextField>
                        <TextField>Relationship*</TextField>
                    </Box>

                    <Button>Save</Button>
                </Box>

                <Typography>Emergency Contact(s)</Typography>
                <Box></Box>
                <Box>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <TextField>First Name*</TextField>
                        <TextField>Middle Name</TextField>
                        <TextField>Last Name*</TextField>
                    </Box>

                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <TextField>Phone*</TextField>
                        <TextField>Email*</TextField>
                        <TextField>Relationship*</TextField>
                    </Box>

                    <Button>Save</Button>

                    { true ?
                        <Box>
                            <Typography>Uploaded Documents</Typography>
                        </Box> :
                        <></>
                    }

                    <Button>Submit</Button>
                </Box>
            </form>
        </Container>
    );
}

export default Onboarding;