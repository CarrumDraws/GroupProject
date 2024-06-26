import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, TextField, Button, Container, Typography } from '@mui/material';

import { validateEmail, validatePassword } from '../utils/AuthValidator.tsx';
import { useOnboarding } from '../context/OnboardingContext.tsx';

interface LoginProps {
    onboardingStatus: string | undefined;
}

const Login: React.FC<LoginProps> = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errs, setErrs] = useState<string[]>([]);
    
    const { onboardingData, setIsLoggedIn } = useOnboarding();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            if(onboardingData?.status === 'Approved') {
                navigate('/profile');
            }else {
                navigate('/onboarding');
            }
        }
    }, [navigate, onboardingData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let validationErrors: string[] = [];
        validateEmail(email, validationErrors);
        validatePassword(password, validationErrors);

        if(validationErrors.length > 0) {
            setErrs(validationErrors);
            return;
        }
        
        try{
            const serverUrl = import.meta.env.VITE_SERVER_URL;
            const response = await axios.post(`${serverUrl}/login`, {
                email,
                password
            });

            if(response.data) {
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);

                if(onboardingData?.status !== 'Approved') {
                    navigate('/onboarding');
                }else {
                    navigate('profile');
                }
            }
        }catch(e: any) {
            if (e.response && e.response.data && e.response.data.message) {
                const errorMessage = e.response.data.message;
                alert('Error logging in: ' + errorMessage);
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
                    display:'flex',
                    flexDirection: 'column',
                    alignItems:'center',
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
                        Sign In
                    </Button>
                </Box>

                <Box sx={{ mt:2 }}>
                    {errs.length > 0 && errs.map((err) => (
                        <Typography key={err} color={'red'}>{err}</Typography>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}

export default Login;