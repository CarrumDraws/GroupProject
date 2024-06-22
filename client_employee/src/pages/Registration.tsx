import React, { useState } from 'react';
import { Box, TextField, Button, Container } from '@mui/material';

function Registration() {
    const [username, setUserame] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Username', username);
        console.log('password', password);
        console.log('confirmation', confirmation);
    }

    const textFieldStyle = {
        height: '1.5rem',
        backgroundColor: '#D9D9D9',
        border: 'none',
        borderRadius: 0,
        '& .MuiOutlinedInput-root': {
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
                        value={username}
                        placeholder='Username'
                        onChange={(e) => setUserame(e.target.value)}
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
                            borderRadius: '0',
                            height: '1.5rem'
                        }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Registration;