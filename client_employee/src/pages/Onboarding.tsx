import { useState, useEffect } from 'react';
import axios from 'axios';

import { Box, TextField, Button, Container, Typography, Select, MenuItem, InputLabel } from '@mui/material';
import { formatDate } from 'react-datepicker/dist/date_utils';

interface OnboardingProps {
    initialStatus: string;
}

const Onboarding: React.FC<OnboardingProps> = ({ initialStatus }) => {
    type Person = {
        firstname: string;
        middlename: string;
        lastname: string;
        phone: string;
        email: string;
        relationship: string;
    };

    const initialPerson = {
        firstname: '',
        middlename: '',
        lastname: '',
        phone: '',
        email: '',
        relationship: ''
    }

    const [onboardingStatus, setOnboardingStatus] = useState<string>(initialStatus);
    const [feedback, setFeedback] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [ecErrors, setEcErrors] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        firstname: '',
        middlename: '',
        lastname: '',
        preferredname: '',
        picture: '',
        buildaptnum: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        cell: '',
        work: '',
        make: '',
        model: '',
        color: '',
        email: '',
        ssn: '',
        dob: '',
        gender: '',
        citizenship:'',
        citizenshiptype: '',
        workauth: '',
        optreciept: '',
        title: '',
        startdate: '',
        enddate: '',
        haslicense: false,
        licensenumber: '',
        expdate: '',
        license: '',
        references: [] as Person[],
        contacts: [] as Person[]
    });
    const [currentReference, setCurrentReference] = useState(initialPerson);
    const [currentEmergencyContact, setCurrentEmergencyContact] = useState(initialPerson);

    useEffect(() => {
        if(onboardingStatus === 'Rejected') {
            // fetch feedback then set it
        }
    }, [onboardingStatus]);

    const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSelectChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event: { target: { files: any; }; }) => {
        const files = event.target.files;
        const newUploadedFiles = [...uploadedFiles];

        for(let i = 0; i < files.length; i++) {
            newUploadedFiles.push(files[i]);
        }

        setUploadedFiles(newUploadedFiles);
    };

    const handleReferenceChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setCurrentReference({
            ...currentReference,
            [name]: value
        });
    };

    const handleEmergencyContactChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setCurrentEmergencyContact({
            ...currentEmergencyContact,
            [name]: value
        });
    };

    const addCurrentReference = () => {
        const refError = document.getElementById('refError');

        if(currentReference.firstname && currentReference.lastname && currentReference.phone &&
            currentReference.email && currentReference.relationship) {
            
            const updatedRefs = [...formData.references, currentReference];
            setFormData({
                ...formData,
                references: updatedRefs
            });

            setCurrentReference(initialPerson);

            if(refError) {
                refError.textContent = '';
            }
        }else if(refError){
            refError.textContent = 'Missing required field(s).';
        }
    }

    const addEmergencyContact = () => {
        if(currentEmergencyContact.firstname && currentEmergencyContact.lastname &&
            currentEmergencyContact.phone && currentEmergencyContact.email &&
            currentEmergencyContact.relationship) {
            
            const updatedEcs = [...formData.contacts, currentEmergencyContact];
            setFormData({
                ...formData,
                contacts: updatedEcs
            });

            setCurrentEmergencyContact(initialPerson);
        }else {
            setEcErrors([...ecErrors, 'Missing requird field(s).']);
        }
    }

    const handleDeleteReference = (fn: string, ln: string) => {
        const updatedRefs = [...formData.references].filter((r) => r.firstname != fn && r.lastname != ln);
        
        setFormData({
            ...formData,
            references: updatedRefs
        });
    }

    const handleDeleteEmergencyContact = (fn: string, ln: string) => {
        const updatedEcs = [...formData.contacts].filter((ec) => ec.firstname != fn && ec.lastname != ln);
        setFormData({
            ...formData,
            contacts: updatedEcs
        });
    }

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // submit form to server
        
        setOnboardingStatus('Pending');
    };

    const centerRowBoxStyle = {
        display: 'flex', flexDirection: 'row', justifyContent: 'center'
    };

    const centerColumnBoxStyle = {
        display: 'flex', flexDirection:'column', alignItems:'center'
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

    const typographyStyle = { mr:'0.5rem', color:'black' };
    
    const selectionLabelStyle = {
        mt: '1.3rem', mr: '0.5rem', color:'black'
    };

    const selectionStyle = {
        height: '2rem',
        width: '12rem',
        mt: '0.95rem',
        '& input': {
            height: '1.5rem',
            padding: '0 0.5rem'
        },
        border: '0.5px solid #9EAABA'
    };

    return (
        <Container sx={{ display: 'flex', width: '100%', justifyContent:'center', paddingTop: '1rem' }}>
            <form>
                <Typography
                    display='flex'
                    justifyContent='center'
                    paddingTop='1rem'
                    fontSize='1.5rem'
                    color='#8696A7'
                    sx={{ textDecoration: 'underline' }}
                >
                    Basic Information
                </Typography>
                <Box sx={centerRowBoxStyle}>
                    <TextField
                        name='firstname'
                        value={formData.firstname}
                        onChange={handleInputChange}
                        placeholder='First Name*'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />

                    <TextField placeholder='Middle Name'
                        name='middlename'
                        value={formData.middlename}
                        onChange={handleInputChange}
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />

                    <TextField
                        name='lastname'
                        value={formData.lastname}
                        onChange={handleInputChange}
                        placeholder='Last Name*'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />
                </Box>

                <Box sx={centerColumnBoxStyle}>
                    <TextField
                        name='preferredname'
                        value={formData.preferredname}
                        onChange={handleInputChange}
                        placeholder='Preferred Name'
                        InputProps={{
                            style: textFieldStyleLong,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem', mb: '1.5rem' }}
                    />

                    <Box sx={centerRowBoxStyle}>
                        <Typography
                            sx={typographyStyle}
                        >
                            Choose Profile Picture
                        </Typography>
                        <input 
                            type='file'
                            name='picture'
                            onChange={handleFileChange}
                        />
                    </Box>
                </Box>

                <Box sx={{display: 'flex', flexDirection: 'row', paddingTop: '0.5rem'}}>
                    <TextField
                        name='buildaptnum'
                        value={formData.buildaptnum}
                        onChange={handleInputChange}
                        placeholder='Building/Apt # *'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />

                    <TextField
                        name='street'
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder='Street Name*'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />

                    <TextField
                        name='city'
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder='City*'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />

                    <TextField
                        name='state'
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder='State*'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />

                    <TextField
                        name='zip'
                        value={formData.zip}
                        onChange={handleInputChange}
                        placeholder='Zip*'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />
                </Box>

                <Box sx={centerRowBoxStyle}>
                    <TextField
                        name='cell'
                        value={formData.cell}
                        onChange={handleInputChange}
                        placeholder='Cell Phone'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />

                    <TextField
                        name='work'
                        value={formData.work}
                        onChange={handleInputChange}
                        placeholder='Work Phone'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />
                </Box>

                <Box sx={centerRowBoxStyle}>
                    <TextField
                        name='make'
                        value={formData.make}
                        onChange={handleInputChange}
                        placeholder='Car Make'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />

                    <TextField
                        name='model'
                        value={formData.model}
                        onChange={handleInputChange}
                        placeholder='Car Model'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />
                    <TextField
                        name='color'
                        value={formData.color}
                        onChange={handleInputChange}
                        placeholder='Car Color'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                     />
                </Box>

                <Box sx={{ display:'flex', justifyContent:'center' }}>
                    <TextField
                        value={formData.email}
                        InputProps={{
                            style: textFieldStyleLong,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                        disabled
                    />
                </Box>

                <Box sx={centerRowBoxStyle}>
                    <TextField
                        name='ssn'
                        value={formData.ssn}
                        onChange={handleInputChange}
                        placeholder='SSN'
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                     />

                    <Typography sx={selectionLabelStyle}>Date of Birth</Typography>
                    <TextField
                        type='date'
                        name='dob'
                        value={formData.dob}
                        onChange={handleInputChange}
                        InputProps={{
                            style: textFieldStyleShort,
                            inputProps: {
                                style: {
                                    textAlign: 'center',
                                    marginRight: '0.5rem'
                                },
                            }
                        }}
                        sx={{ mt: '1rem', mr: '0.5rem' }}
                    />
                    
                    <InputLabel id="gender-label" sx={selectionLabelStyle}>Gender</InputLabel>
                    <Select
                        name='gender'
                        value={formData.gender}
                        onChange={handleSelectChange}
                        labelId='gender-label'
                        sx={selectionStyle}
                    >
                        <MenuItem value='Male'>Male</MenuItem>
                        <MenuItem value='Female'>Female</MenuItem>
                        <MenuItem value='N/A'>I do not wish to answer</MenuItem>
                    </Select>
                </Box>

                <Box sx={centerRowBoxStyle}>
                    <InputLabel id="citizenship-label" sx={selectionLabelStyle}>
                        Are you a citizen or permanent resident of the U.S?
                    </InputLabel>
                    <Select
                        name='citizenship'
                        value={formData.citizenship}
                        onChange={handleSelectChange}
                        labelId='citizenship-label'
                        sx={selectionStyle}
                    >
                        <MenuItem value='Is Citizen'>Yes</MenuItem>
                        <MenuItem value='Not Citizen'>No</MenuItem>
                    </Select>
                </Box>

                {(() => {
                    switch(formData.citizenship){
                        case 'Is Citizen':
                            return (
                                <Box sx={centerRowBoxStyle}>
                                    <InputLabel id="citizen-label" sx={selectionLabelStyle}>Select Type: </InputLabel>
                                    <Select
                                        name='citizenshiptype'
                                        value={formData.citizenshiptype}
                                        onChange={handleSelectChange}
                                        labelId='citizen-label'
                                        sx={selectionStyle}
                                    >
                                        <MenuItem value='Green Card'>Green Card</MenuItem>
                                        <MenuItem value='Citizen'>Citizen</MenuItem>
                                    </Select>
                                </Box>
                            );
                        case 'Not Citizen':
                            return (
                                (<Box>
                                    <Box sx={centerRowBoxStyle}>
                                        <InputLabel id="workauth-label" sx={selectionLabelStyle}>What is your work authorization?</InputLabel>
                                        <Select
                                            name='workauth'
                                            value={formData.workauth}
                                            onChange={handleSelectChange}
                                            labelId='workauth-label'
                                            sx={selectionStyle}
                                        >
                                            <MenuItem value='H1-B'>H1-B</MenuItem>
                                            <MenuItem value='L2'>L2</MenuItem>
                                            <MenuItem value='F1(CPT/OPT)'>F1(CPT/OPT)</MenuItem>
                                            <MenuItem value='H4'>H4</MenuItem>
                                            <MenuItem value='Other'>Other</MenuItem>
                                        </Select>
                                    </Box>

                                    {(() => {
                                        switch(formData.workauth){
                                            case 'F1(CPT/OPT)':
                                                return (
                                                    <Box sx={{ display:'flex', justifyContent:'center', mt:'1rem' }}>
                                                        <Typography
                                                            sx={typographyStyle}
                                                        >
                                                            Upload OPT Reciept
                                                        </Typography>
                                                        <input type='file' />
                                                    </Box>
                                                );
                                            case 'H1-B':
                                            case 'L2':
                                            case 'H4':
                                            case 'Other':
                                                return (
                                                    <Box sx={{ display:'flex', justifyContent:'center' }}>
                                                        <TextField
                                                            placeholder='Visa Title'
                                                            InputProps={{
                                                                style: textFieldStyleLong,
                                                                inputProps: {
                                                                    style: {
                                                                        textAlign: 'center',
                                                                        marginRight: '0.5rem'
                                                                    },
                                                                }
                                                            }}
                                                            sx={{ mt: '1rem', mr: '0.5rem' }}
                                                        />
                                                    </Box>
                                                );
                                            default: return <></>
                                        }
                                    })()}
            
                                    <Box sx={centerRowBoxStyle}>
                                        <Typography sx={selectionLabelStyle}>Start Date</Typography>
                                        <TextField
                                            type='date'
                                            name='startdate'
                                            value={formData.startdate}
                                            onChange={handleInputChange}
                                            InputProps={{
                                                style: textFieldStyleShort,
                                                inputProps: {
                                                    style: {
                                                        textAlign: 'center',
                                                        marginRight: '0.5rem'
                                                    },
                                                }
                                            }}
                                            sx={{ mt: '1rem', mr: '0.5rem' }}
                                        >
                                            Start Date
                                        </TextField>
            
                                        <Typography sx={selectionLabelStyle}>End Date</Typography>
                                        <TextField
                                            type='date'
                                            name='enddate'
                                            value={formData.enddate}
                                            onChange={handleInputChange}
                                            InputProps={{
                                                style: textFieldStyleShort,
                                                inputProps: {
                                                    style: {
                                                        textAlign: 'center',
                                                        marginRight: '0.5rem'
                                                    },
                                                }
                                            }}
                                            sx={{ mt: '1rem', mr: '0.5rem' }}
                                        >
                                            End Date
                                        </TextField>
                                    </Box>
                                </Box>)
                            );
                        default: return <></>;
                    }
                })()}

                <Box sx={centerRowBoxStyle}>
                    <InputLabel id="license-label" sx={selectionLabelStyle}>Do you have a driver's license?</InputLabel>
                    <Select
                        name='haslicense'
                        value={formData.haslicense ? 'Yes' : 'No'}
                        onChange={(e: { target: { name: string; value: string; }; }) => {
                            const { name, value } = e.target;
                            setFormData({
                                ...formData,
                                [name]: (value === 'Yes')
                            });
                        }}
                        labelId='license-label'
                        sx={selectionStyle}
                    >
                        <MenuItem value='Yes'>Yes</MenuItem>
                        <MenuItem value='No'>No</MenuItem>
                    </Select>
                </Box>

                { formData.haslicense ?
                    <Box>
                        <Box sx={centerRowBoxStyle}>
                            <TextField
                                name='licensenumber'
                                value={formData.licensenumber}
                                onChange={handleInputChange}
                                placeholder='License Number'
                                InputProps={{
                                    style: textFieldStyleShort,
                                    inputProps: {
                                        style: {
                                            textAlign: 'center',
                                            marginRight: '0.5rem'
                                        },
                                    }
                                }}
                                sx={{ mt: '1rem', mr: '0.5rem' }}
                            />

                            <Typography sx={selectionLabelStyle}>Expiration Date</Typography>
                            <TextField
                                type='date'
                                name='expdate'
                                value={formData.expdate}
                                onChange={handleInputChange}
                                InputProps={{
                                    style: textFieldStyleShort,
                                    inputProps: {
                                        style: {
                                            textAlign: 'center',
                                            marginRight: '0.5rem'
                                        },
                                    }
                                }}
                                sx={{ mt: '1rem', mr: '0.5rem', mb: '1rem' }}
                            />
                        </Box>

                        <Box sx={centerRowBoxStyle}>
                            <Typography sx={typographyStyle}>Please upload a copy of your license</Typography>
                            <input
                                type='file'
                                name='license'
                                onChange={handleFileChange}
                            />
                        </Box>
                    </Box> :
                    <></>
                }

                <Typography
                    display='flex'
                    justifyContent='center'
                    paddingTop='1.5rem'
                    fontSize='1.5rem'
                    color='#8696A7'
                    sx={{ textDecoration: 'underline' }}
                >
                    Reference
                </Typography>

                <Typography id='refError' color='red' sx={centerRowBoxStyle}></Typography>

                <Box sx={centerRowBoxStyle} paddingTop='0.5rem'>
                    {formData.references.map((r) => (
                        <Box key={`${r.firstname}-${r.lastname}-${r.relationship}`} sx={centerColumnBoxStyle} paddingLeft='1.5rem' paddingRight='1.5rem'>
                            <Typography>{r.firstname} {r.middlename} {r.lastname} ({r.relationship}): </Typography>
                            <Typography>{r.phone}</Typography>
                            <Typography>{r.email}</Typography>
                            <Button sx={{ mt:0, paddingTop:0 }} onClick={() => handleDeleteReference(r.firstname, r.lastname)}>Delete</Button>
                        </Box>
                    ))}
                </Box>
                <Box sx={centerColumnBoxStyle}>
                    <Box sx={centerRowBoxStyle}>
                        <TextField
                            name='firstname'
                            value={currentReference.firstname}
                            onChange={handleReferenceChange}
                            placeholder='First Name*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />

                        <TextField
                            name='middlename'
                            value={currentReference.middlename}
                            onChange={handleReferenceChange}
                            placeholder='Middle Name'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />

                        <TextField
                            name='lastname'
                            value={currentReference.lastname}
                            onChange={handleReferenceChange}
                            placeholder='Last Name*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />
                    </Box>

                    <Box sx={centerRowBoxStyle}>
                        <TextField
                            name='phone'
                            value={currentReference.phone}
                            onChange={handleReferenceChange}
                            placeholder='Phone*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />
                        
                        <TextField
                            name='email'
                            value={currentReference.email}
                            onChange={handleReferenceChange}
                            placeholder='Email*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />
                        
                        <TextField
                            name='relationship'
                            value={currentReference.relationship}
                            onChange={handleReferenceChange}
                            placeholder='Relationship*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem', mb: '1rem' }}
                        />
                    </Box>

                    <Button onClick={addCurrentReference}>Save</Button>
                </Box>

                <Typography
                    display='flex'
                    justifyContent='center'
                    paddingTop='1rem'
                    fontSize='1.5rem'
                    color='#8696A7'
                    sx={{ textDecoration: 'underline' }}
                >
                    Emergency Contact(s)
                </Typography>

                <Box sx={centerColumnBoxStyle}>
                    {ecErrors.map((e) => (
                        <Typography color='red'>{e}</Typography>
                    ))}
                </Box>

                <Box sx={centerColumnBoxStyle}>
                    {formData.contacts.map((c) => (
                        <Box key={`${c.firstname}-${c.lastname}-${c.relationship}`} sx={centerColumnBoxStyle}>
                            <Typography>{c.firstname} {c.middlename} {c.lastname} ({c.relationship}): </Typography>
                            <Typography>{c.phone}</Typography>
                            <Typography>{c.email}</Typography>
                            <Button sx={{ mt:0, paddingTop:0 }} onClick={() => handleDeleteEmergencyContact(c.firstname, c.lastname)}>Delete</Button>
                        </Box>
                    ))}
                </Box>
                <Box sx={centerColumnBoxStyle}>
                    <Box sx={centerRowBoxStyle}>
                        <TextField
                            name='firstname'
                            value={currentEmergencyContact.firstname}
                            onChange={handleEmergencyContactChange}
                            placeholder='First Name*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />

                        <TextField
                            name='middlename'
                            value={currentEmergencyContact.middlename}
                            onChange={handleEmergencyContactChange}
                            placeholder='Middle Name'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />

                        <TextField
                            name='lastname'
                            value={currentEmergencyContact.lastname}
                            onChange={handleEmergencyContactChange}
                            placeholder='Last Name*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />
                    </Box>

                    <Box sx={centerRowBoxStyle}>
                        <TextField
                            name='phone'
                            value={currentEmergencyContact.phone}
                            onChange={handleEmergencyContactChange}
                            placeholder='Phone*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />
                        
                        <TextField
                            name='email'
                            value={currentEmergencyContact.email}
                            onChange={handleEmergencyContactChange}
                            placeholder='Email*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem' }}
                        />
                        
                        <TextField
                            name='relationship'
                            value={currentEmergencyContact.relationship}
                            onChange={handleEmergencyContactChange}
                            placeholder='Relationship*'
                            InputProps={{
                                style: textFieldStyleShort,
                                inputProps: {
                                    style: {
                                        textAlign: 'center',
                                        marginRight: '0.5rem'
                                    },
                                }
                            }}
                            sx={{ mt: '1rem', mr: '0.5rem', mb: '1rem' }}
                        />
                    </Box>

                    <Button onClick={addEmergencyContact}>Save</Button>

                    { uploadedFiles.length !== 0 ?
                        <Box>
                            <Typography
                                display='flex'
                                justifyContent='center'
                                paddingTop='1rem'
                                fontSize='1.5rem'
                                color='#8696A7'
                                sx={{ textDecoration: 'underline' }}
                            >
                                Uploaded Documents
                            </Typography>

                            {uploadedFiles.map((f) => (
                                <Box key={f.name} sx={centerColumnBoxStyle}>
                                    <Button>{f.name}</Button>
                                </Box>
                            ))}
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