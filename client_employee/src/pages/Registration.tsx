import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Container, Typography } from '@mui/material';

import { validateEmail, validatePassword, validateConfirmation } from '../utils/AuthValidator.tsx';

function Registration() {
    const { token } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [errs, setErrs] = useState<string[]>([]);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        var validationErrors: string[] = [];
        validateEmail(email, validationErrors);
        validatePassword(password, validationErrors);
        validateConfirmation(password, confirmation, validationErrors);

        if (validationErrors.length > 0) {
            setErrs(validationErrors);
            return;
        }

        try {
            const serverUrl = import.meta.env.VITE_SERVER_URL;
            const employeeUrl = import.meta.env.VITE_EMPLOYEE_URL;

            const response = await axios.post(`${serverUrl}/register`, {
                email,
                password,
                link: `${employeeUrl}/register/${token}`
            });

            if (response.data) {
                alert('Registration successful!');
                navigate('/login');
            }
        } catch (e : any) {
            if (e.response && e.response.data && e.response.data.message) {
                const errorMessage = e.response.data.message;
                alert('Error during registration: ' + errorMessage);
            }
            
        }
    }

    const textFieldStyle = {
        height: '1.5rem',
        backgroundColor: 'white',
        border: 'none',
        borderRadius: '5px',
        '& .MuiOutlinedInputRoot': {
            '& fieldset': {
                borderColor: 'transparent',
            },
            '&:hover fieldset': {
                borderColor: 'transparent',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'transparent',
            },
        },
    };

    return (
        <Container maxWidth='sm'>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh'
                }}
            >
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '80%'
                    }}
                >
                    <TextField
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        margin='normal'
                        required
                        fullWidth
                        InputProps={{
                            style: textFieldStyle,
                            inputProps: {
                                style: {
                                    textAlign: 'center'
                                },
                            }
                        }}
                    />

                    <TextField
                        type='password'
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        margin='normal'
                        required
                        fullWidth
                        InputProps={{
                            style: textFieldStyle,
                            inputProps: {
                                style: {
                                    textAlign: 'center'
                                },
                            }
                        }}
                    />

                    <TextField
                        type='password'
                        value={confirmation}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmation(e.target.value)}
                        margin='normal'
                        required
                        fullWidth
                        InputProps={{
                            style: textFieldStyle,
                            inputProps: {
                                style: {
                                    textAlign: 'center'
                                },
                            }
                        }}
                    />

                    <Button
                        type='submit'
                        variant='contained'
                        sx={{
                            mt: 2,
                            mb: 2,
                            backgroundColor: '#41AFFF',
                            borderRadius: '5px',
                            height: '1.5rem'
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>

                <Box sx={{ mt: 2 }}>
                    {errs.length > 0 && errs.map((err) => (
                        <Typography key={err} color={'red'}>{err}</Typography>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}

export default Registration;