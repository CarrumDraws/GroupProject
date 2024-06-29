import { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Container, Typography, Select, MenuItem, InputLabel } from '@mui/material';

import LoadingScreen from '../components/LoadingScreen.tsx';
import OnboardingField from '../components/OnboardingField.tsx';
import OnboardingFileInput from '../components/OnboardingFileInput.tsx';
import OnboardingPersonInput from '../components/OnboardingPersonInput.tsx';
import axiosInstance from '../interceptors/axiosInstance.tsx';
import { Name, EmployeeInfo, Address, Phone, Car } from '../types/EmployeeInfo.tsx';
import { Person, PersonKeys } from '../types/Person.tsx';
import { capitalizeFirstLetter, createEmptyFormObject, formatDate, handleLogout, isFileData } from '../utils/utilMethods.tsx';
import { useOnboarding } from '../context/OnboardingContext.tsx';
import { FileData } from '../types/FileData.tsx';

interface FormData {
    firstname: string;
    middlename: string;
    lastname: string;
    preferredname: string;
    picture: File | null | string;
    buildaptnum: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    cell: string;
    work: string;
    make: string;
    model: string;
    color: string;
    ssn: string;
    dob: string;
    gender: string;
    citizenship: string;
    citizenshiptype: string;
    workauth: string;
    optreciept: File | null | string; // not in the GET Onboarding data
    title: string;
    startdate: string;
    enddate: string;
    haslicense: string;
    licensenumber: string;
    expdate: string;
    license: File | null | string;
    references: Person[];
    contacts: Person[];
}

type FormDataKeys = keyof FormData;

const Onboarding = () => {
    const navigate = useNavigate();

    const initialPerson = {
        firstname: '',
        middlename: '',
        lastname: '',
        phone: '',
        email: '',
        relationship: '',
        _id: ''
    }

    const initialData: EmployeeInfo = {
        employee_id: {
            _id: '',
            email: '',
            password: '',
            isHR: false,
            __v: -1
        },
        name: createEmptyFormObject<Name>(),
        picture: null,
        address: createEmptyFormObject<Address>(),
        phone: createEmptyFormObject<Phone>(),
        car: createEmptyFormObject<Car>(),
        ssn: null,
        dob: null,
        gender: '',
        citizenship: null,
        citizenshiptype: '',
        workauth: {
            workauth: '',
            title: '',
            startdate: null,
            enddate: null,
            _id: ''
        },
        license: {
            haslicense: 'false',
            licensenumber: '',
            expdate: null,
            licensefile: null,
            _id: ''
        },
        references: [],
        contacts: [],
        status: 'Not Started',
        feedback: '',
        __v: -1
    }

    // getting the initial onboarding data from server with loading
    const { onboardingData, optReciept, files, isLoading } = useOnboarding();

    const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | FileData }>(files ? files : {});
    const [refErrors, setRefErrors] = useState<string[]>([]);
    const [ecErrors, setEcErrors] = useState<string[]>([]);
    const [currentReference, setCurrentReference] = useState<Person>(initialPerson);
    const [currentEmergencyContact, setCurrentEmergencyContact] = useState<Person>(initialPerson);
    const [formData, setFormData] = useState<FormData>({
        firstname: initialData.name.firstname,
        middlename: initialData.name.middlename,
        lastname: initialData.name.lastname,
        preferredname: initialData.name.preferredname,
        picture: initialData.picture ? initialData.picture : null,
        buildaptnum: initialData.address.buildaptnum ? initialData.address.buildaptnum : '',
        street: initialData.address.street,
        city: initialData.address.city,
        state: initialData.address.state,
        zip: initialData.address.zip,
        cell: initialData.phone.cell,
        work: initialData.phone.work,
        make: initialData.car.make,
        model: initialData.car.model,
        color: initialData.car.color,
        ssn: initialData.ssn ? initialData.ssn : '',
        dob: initialData.dob ? formatDate(initialData.dob, '-') : '',
        gender: initialData.gender,
        citizenship: initialData.citizenship ? initialData.citizenship : 'false',
        citizenshiptype: initialData.citizenshiptype,
        workauth: initialData.workauth.workauth,
        optreciept: optReciept,
        title: initialData.workauth.title,
        startdate: initialData.workauth.startdate ? formatDate(initialData.workauth.startdate, '-') : '',
        enddate: initialData.workauth.enddate ? formatDate(initialData.workauth.enddate, '-') : '',
        haslicense: initialData.license.haslicense === 'true' ? 'true' : 'false',
        licensenumber: initialData.license.licensenumber,
        expdate: initialData.license.expdate ? formatDate(initialData.license.expdate, '-') : '',
        license: initialData.license.licensefile,
        references: initialData.references,
        contacts: initialData.contacts
    });

    // setting whether the form is disabled according to the status
    let isDisabled = false;
    if(onboardingData && (onboardingData?.status === 'Pending' || onboardingData?.status === 'Approved')) {
        isDisabled = true;
    }

    let feedback = onboardingData && onboardingData.feedback ? `${onboardingData.feedback}` : '';
    if(feedback && feedback !== '') {
        feedback = 'Rejected - ' + feedback;
    }
    if(onboardingData && onboardingData?.status === 'Approved') {
        feedback = 'Approved - You can view and edit your information in the profile(home) page.';
    }

    useEffect(() => {
        if (onboardingData) {
            setFormData(prevFormData => ({
                ...prevFormData,
                firstname: onboardingData.name.firstname,
                middlename: onboardingData.name.middlename,
                lastname: onboardingData.name.lastname,
                preferredname: onboardingData.name.preferredname,
                picture: onboardingData.picture ? onboardingData.picture : null,
                buildaptnum: onboardingData.address.buildaptnum ? onboardingData.address.buildaptnum : '',
                street: onboardingData.address.street,
                city: onboardingData.address.city,
                state: onboardingData.address.state,
                zip: onboardingData.address.zip,
                cell: onboardingData.phone.cell ? onboardingData.phone.cell : '',
                work: onboardingData.phone.work ? onboardingData.phone.work : '',
                make: onboardingData.car.make,
                model: onboardingData.car.model,
                color: onboardingData.car.color,
                ssn: onboardingData.ssn ? onboardingData.ssn : '',
                dob: onboardingData.dob ? formatDate(onboardingData.dob, '-') : '',
                gender: onboardingData.gender,
                citizenship: onboardingData.citizenship ? onboardingData.citizenship : 'false',
                citizenshiptype: onboardingData.citizenshiptype,
                workauth: onboardingData.workauth.workauth,
                optreciept: optReciept ? optReciept : null,
                title: onboardingData.workauth.title,
                startdate: onboardingData.workauth.startdate ? formatDate(onboardingData.workauth.startdate, '-') : '',
                enddate: onboardingData.workauth.enddate ? formatDate(onboardingData.workauth.enddate, '-') : '',
                haslicense: onboardingData.license.haslicense ? 'true' : 'false',
                licensenumber: onboardingData.license.licensenumber,
                expdate: onboardingData.license.expdate ? formatDate(onboardingData.license.expdate, '-') : '',
                license: onboardingData.license.licensefile,
                references: onboardingData.references,
                contacts: onboardingData.contacts
            }));

            if(onboardingData.status === 'Pending' || onboardingData.status === "Approved") {
                setUploadedFiles(files);
            }
        }
    }, [onboardingData, optReciept, files]);

    const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name } = event.target;
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setFormData({
                ...formData,
                [name]: file
            });

            setUploadedFiles(prevFiles => {
                const updatedFiles = { ...prevFiles, [name]: file };
                return updatedFiles;
            });
        }
    };

    const handlePersonChange = (setter: React.Dispatch<React.SetStateAction<Person>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setter(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addPerson = (
        currentPerson: Person,
        setter: React.Dispatch<React.SetStateAction<Person>>,
        arrKey: keyof typeof formData,
        errorsSetter: React.Dispatch<React.SetStateAction<string[]>>,
        errors: string[]
      ) => {
        const requiredFields: PersonKeys[] = ['firstname', 'lastname', 'phone', 'email', 'relationship'];
        const missingFields = requiredFields.filter(field => !currentPerson[field]);
      
        if (missingFields.length === 0) {
            setFormData(prev => ({
                ...prev,
                [arrKey]: [...(prev[arrKey] as Person[]), currentPerson]
            }));
            setter(initialPerson);
            if (errors.length) errorsSetter([]);
        } else {
            const errorMessage = 'Missing required field(s).';
            if (!errors.includes(errorMessage)) {
                errorsSetter([...errors, errorMessage]);
            }
        }
      };
    

    const deletePerson = (arrKey: keyof FormData, person: Person) => {
        setFormData(prev => ({
            ...prev,
            [arrKey]: (prev[arrKey] as Person[]).filter(p => 
                p.firstname !== person.firstname || 
                p.middlename !== person.middlename || 
                p.lastname !== person.lastname || 
                p.phone !== person.phone || 
                p.email !== person.email || 
                p.relationship !== person.relationship)
        }));
    };

    // not important
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

    const getRequiredFields = (): FormDataKeys[] => {
        const requiredFields: FormDataKeys[] = [
            'firstname',
            'lastname',
            'buildaptnum',
            'street',
            'city',
            'state',
            'zip',
            'cell',
            'ssn',
            'dob',
            'gender',
            'citizenship',
            'haslicense'
        ];

        if (formData.citizenship === 'false') {
            requiredFields.push('workauth', 'startdate', 'enddate');
            if(formData.workauth === 'F1(CPT/OPT)') {
                requiredFields.push('optreciept');
            }
            if (formData.workauth === 'Other') {
                requiredFields.push('title');
            }
        }

        if (formData.haslicense === 'ture') {
            requiredFields.push('licensenumber', 'expdate', 'license');
        }

        return requiredFields;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if there is a required field missing
        const requiredFields = getRequiredFields();
        const missingFields = requiredFields.filter(field => !formData[field]);

        const requiredError = document.getElementById('requiredError');
        if(requiredError) {
            requiredError.textContent = '';
        }
        if (missingFields.length > 0) {
            if (requiredError) {
                requiredError.textContent = 'Missing required field(s)';
            }
            return;
        }

        // Check if there is at least one emergency contact
        if (formData.contacts.length < 1) {
            const errorMessage = 'You need at least one emergency contact.';
            if (!ecErrors.includes(errorMessage)) {
                setEcErrors([...ecErrors, errorMessage]);
            }
            return;
        }

        // Create FormData object
        const data = new FormData();

        // Append form fields to FormData
        Object.keys(formData).forEach(key => {
            const value = (formData as FormData)[key as FormDataKeys];
            
            if (value instanceof File) {
                if (value !== null) {
                    data.append(key, value);
                }
            } else if (Array.isArray(value)) {
                data.append(key, JSON.stringify(value));
            } else{
                data.append(key, value !== null ? value.toString() : '');
            }
        });

        // submit form to server
        try {
            const response = await axiosInstance.post(`${import.meta.env.VITE_SERVER_URL}/onboarding`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('Form submitted successfully.');
                if(requiredError) {
                    requiredError.textContent = '';
                }
                navigate('/profile');
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                alert('Error submitting form: ' + errorMessage);
            }
        }
    };

    const centerRowBoxStyle = {
        display: 'flex', flexDirection: 'row', justifyContent: 'center'
    };

    const centerColumnBoxStyle = {
        display: 'flex', flexDirection:'column', alignItems:'center'
    }

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

    if(isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems:'center', paddingTop: '1rem' }}>
            { feedback === '' ? <></> : <Typography variant="body1" paragraph color='red'>{feedback}</Typography>}
            
            <form onSubmit={handleSubmit}>
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
                    {(['firstname', 'middlename', 'lastname'] as const).map(field => (
                        <OnboardingField 
                            key={field} 
                            isLong={false} 
                            label={generateNameLabel(field)} 
                            type='text' 
                            name={field} 
                            value={formData[field]} 
                            onChange={handleInputChange} 
                            isDisabled={isDisabled} 
                        />
                    ))}
                </Box>

                <Box sx={centerColumnBoxStyle}>
                    <OnboardingField
                        isLong={true}
                        label='Preferred Name'
                        type='text'
                        name='preferredname'
                        value={formData.preferredname}
                        onChange={handleInputChange}
                        isDisabled={isDisabled}
                    />

                    <OnboardingFileInput
                        boxStyle={{...centerRowBoxStyle, paddingTop:'1.5rem'}}
                        titleStyle={typographyStyle}
                        title='Choose Profile Picture'
                        name='picture'
                        onChange={handleFileChange}
                        isDisabled={isDisabled}
                    />
                </Box>

                <Box sx={centerRowBoxStyle} paddingTop='0.5rem'>
                    {(['buildaptnum', 'street', 'city', 'state', 'zip'] as const).map(field => (
                        <OnboardingField
                            key={field}
                            isLong={false}
                            label={field === 'buildaptnum' ? 'Building/Apt # *' : `${field.charAt(0).toUpperCase() + field.slice(1)}*`}
                            type='text'
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            isDisabled={isDisabled}
                        />
                    ))}
                </Box>

                <Box sx={centerRowBoxStyle}>
                    {(['cell', 'work'] as const).map(field => (
                        <OnboardingField
                            key={field}
                            isLong={false}
                            label={`${field.charAt(0).toUpperCase() + field.slice(1)} Phone${field === 'cell' ? '*' : ''}`}
                            type='text'
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            isDisabled={isDisabled}
                        />
                    ))}
                </Box>

                <Box sx={centerRowBoxStyle}>
                    {(['make', 'model', 'color'] as const).map(field => (
                        <OnboardingField
                            key={field}
                            isLong={false}
                            label={`Car ${field.charAt(0).toUpperCase() + field.slice(1)}`}
                            type='text'
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            isDisabled={isDisabled}
                        />
                    ))}
                </Box>

                <Box sx={{ display:'flex', justifyContent:'center' }}>
                    <OnboardingField
                        isLong={true}
                        label='Email'
                        type='text'
                        name=''
                        value={initialData.employee_id.email}
                        onChange={()=>{}}
                        isDisabled={true}
                    />
                </Box>

                <Box sx={centerRowBoxStyle}>
                    <OnboardingField
                        isLong={false}
                        label='SSN'
                        type='text'
                        name='ssn'
                        value={formData.ssn}
                        onChange={handleInputChange}
                        isDisabled={isDisabled}
                    />

                    <Typography sx={selectionLabelStyle}>Date of Birth</Typography>
                    <OnboardingField
                        isLong={false}
                        label=''
                        type='date'
                        name='dob'
                        value={formData.dob.toString()}
                        onChange={handleInputChange}
                        isDisabled={isDisabled}
                    />
                    
                    <InputLabel id="gender-label" sx={selectionLabelStyle}>Gender</InputLabel>
                    <Select
                        name='gender'
                        value={formData.gender}
                        onChange={handleInputChange}
                        labelId='gender-label'
                        sx={selectionStyle}
                        disabled={isDisabled}
                    >
                        <MenuItem value='Male'>Male</MenuItem>
                        <MenuItem value='Female'>Female</MenuItem>
                        <MenuItem value='Other'>I do not wish to answer</MenuItem>
                    </Select>
                </Box>

                <Box sx={centerRowBoxStyle}>
                    <InputLabel id="citizenship-label" sx={selectionLabelStyle}>
                        Are you a citizen or permanent resident of the U.S?
                    </InputLabel>
                    <Select
                        name='citizenship'
                        value={formData.citizenship}
                        onChange={handleInputChange}
                        labelId='citizenship-label'
                        sx={selectionStyle}
                        disabled={isDisabled}
                    >
                        <MenuItem value='true'>Yes</MenuItem>
                        <MenuItem value='false'>No</MenuItem>
                    </Select>
                </Box>

                {(() => {
                    switch(formData.citizenship){
                        case 'true':
                            return (
                                <Box sx={centerRowBoxStyle}>
                                    <InputLabel id="citizen-label" sx={selectionLabelStyle}>
                                        Select Type:
                                    </InputLabel>

                                    <Select
                                        name='citizenshiptype'
                                        value={formData.citizenshiptype}
                                        onChange={handleInputChange}
                                        labelId='citizen-label'
                                        sx={selectionStyle}
                                        disabled={isDisabled}
                                    >
                                        <MenuItem value='Green Card'>Green Card</MenuItem>
                                        <MenuItem value='Citizen'>Citizen</MenuItem>
                                    </Select>
                                </Box>
                            );
                        case 'false':
                            return (
                                (<Box>
                                    <Box sx={centerRowBoxStyle}>
                                        <InputLabel id="workauth-label" sx={selectionLabelStyle}>
                                            What is your work authorization?
                                        </InputLabel>

                                        <Select
                                            name='workauth'
                                            value={formData.workauth}
                                            onChange={handleInputChange}
                                            labelId='workauth-label'
                                            sx={selectionStyle}
                                            disabled={isDisabled}
                                        >
                                            {['H1-B', 'L2', 'F1(CPT/OPT)', 'H4', 'Other'].map((auth, _index) => (
                                                <MenuItem key={auth} value={auth}>{auth}</MenuItem>
                                            ))}
                                        </Select>
                                    </Box>

                                    {(() => {
                                        switch(formData.workauth){
                                            case 'F1(CPT/OPT)':
                                                return (
                                                    <OnboardingFileInput
                                                        boxStyle={{ display:'flex', justifyContent:'center', mt:'1.5rem', mb: '1rem' }}
                                                        titleStyle={typographyStyle}
                                                        title='Upload OPT Reciept'
                                                        name='optreciept'
                                                        onChange={handleFileChange}
                                                        isDisabled={isDisabled}
                                                    />
                                                );
                                            case 'Other':
                                                return (
                                                    <Box sx={{ display:'flex', justifyContent:'center' }}>
                                                        <OnboardingField
                                                            isLong={true}
                                                            label='Visa Title*'
                                                            type='text'
                                                            name='title'
                                                            value={formData.title}
                                                            onChange={handleInputChange}
                                                            isDisabled={isDisabled}
                                                        />
                                                    </Box>
                                                );
                                            default: return <></>
                                        }
                                    })()}
            
                                    <Box sx={centerRowBoxStyle}>
                                        <Typography sx={selectionLabelStyle}>Start Date</Typography>
                                        <OnboardingField
                                            isLong={false}
                                            label=''
                                            type='date'
                                            name='startdate'
                                            value={formData.startdate.toString()}
                                            onChange={handleInputChange}
                                            isDisabled={isDisabled}
                                        />
            
                                        <Typography sx={selectionLabelStyle}>End Date</Typography>
                                        <OnboardingField
                                            isLong={false}
                                            label=''
                                            type='date'
                                            name='enddate'
                                            value={formData.enddate.toString()}
                                            onChange={handleInputChange}
                                            isDisabled={isDisabled}
                                        />
                                    </Box>
                                </Box>)
                            );
                        default: return <></>;
                    }
                })()}

                <Box sx={centerRowBoxStyle}>
                    <InputLabel id="license-label" sx={selectionLabelStyle}>
                        Do you have a driver's license?
                    </InputLabel>

                    <Select
                        name='haslicense'
                        value={formData.haslicense}
                        onChange={(e) => setFormData({ ...formData, haslicense: e.target.value })}
                        labelId='license-label'
                        sx={selectionStyle}
                        disabled={isDisabled}>
                        <MenuItem value='true'>Yes</MenuItem>
                        <MenuItem value='false'>No</MenuItem>
                    </Select>
                </Box>

                { formData.haslicense === 'true' ?
                    <Box>
                        <Box sx={centerRowBoxStyle}>
                            <OnboardingField
                                isLong={false}
                                label='License Number'
                                type='text'
                                name='licensenumber'
                                value={formData.licensenumber}
                                onChange={handleInputChange}
                                isDisabled={isDisabled}
                            />

                            <Typography sx={selectionLabelStyle}>Expiration Date</Typography>
                            <OnboardingField
                                isLong={false}
                                label=''
                                type='date'
                                name='expdate'
                                value={formData.expdate.toString()}
                                onChange={handleInputChange}
                                isDisabled={isDisabled}
                            />
                        </Box>

                        <OnboardingFileInput
                            boxStyle={{...centerRowBoxStyle, mt: '1.5rem'}}
                            titleStyle={typographyStyle}
                            title='Please upload a copy of your license'
                            name='license'
                            onChange={handleFileChange}
                            isDisabled={isDisabled}
                        />
                    </Box> :
                    <></>
                }
                
                <OnboardingPersonInput
                    boxRowStyle={centerRowBoxStyle}
                    boxColumnStyle={centerColumnBoxStyle}
                    title='Reference'
                    errors={refErrors}
                    personArr={formData.references}
                    handleDelete={(person) => deletePerson('references', person)}
                    currentPerson={currentReference}
                    handlePersonChange={handlePersonChange(setCurrentReference)}
                    isDisabled={isDisabled}
                    handleAdd={() => addPerson(currentReference,setCurrentReference, 'references', setRefErrors, refErrors)}
                />

                <OnboardingPersonInput
                    boxRowStyle={centerRowBoxStyle}
                    boxColumnStyle={centerColumnBoxStyle}
                    title='Emergency Contact'
                    errors={ecErrors}
                    personArr={formData.contacts}
                    handleDelete={(person) => deletePerson('contacts', person)}
                    currentPerson={currentEmergencyContact}
                    handlePersonChange={handlePersonChange(setCurrentEmergencyContact)}
                    isDisabled={isDisabled}
                    handleAdd={() => addPerson(currentEmergencyContact, setCurrentEmergencyContact, 'contacts', setEcErrors, ecErrors)}
                />

                <Box sx={centerRowBoxStyle}>
                    {Object.keys(uploadedFiles).length !== 0 ? (
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

                            {Object.keys(uploadedFiles).map((key) => {
                                const file = uploadedFiles[key];

                                return (
                                    <Box key={key} sx={centerColumnBoxStyle}>
                                        {isFileData(file) ?
                                            (
                                                <Box sx={centerRowBoxStyle}>
                                                    <Typography paddingRight='0.5rem'>{key == 'optreciept' ? 'OPT Reciept' : capitalizeFirstLetter(key)}:</Typography>
                                                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                                                        <Typography>{file.filename}</Typography>
                                                    </a>
                                                </Box>
                                            ) :
                                            (
                                                <Typography>
                                                    {key == 'optreciept' ? 'OPT Reciept' : capitalizeFirstLetter(key)} : {file.name}
                                                </Typography>
                                            )
                                        }
                                    </Box>
                                );
                            })}
                        </Box>
                    ) : (
                        <></>
                    )}
                </Box>

                <Box sx={centerColumnBoxStyle} paddingTop='1rem'>
                    <Typography id='requiredError' color='red'></Typography>
                    <Box sx={centerRowBoxStyle}>
                        <Button type='submit' sx={{ fontSize:'1rem', paddingRight: '1.5rem' }} disabled={isDisabled}>Submit</Button>
                        <Button onClick={handleLogout} sx={{ color:'red', borderColor:'red', fontSize: '1rem', paddingLeft: '1.5rem' }}>Log Out</Button>
                    </Box>
                </Box>
            </form>
        </Container>
    );
}

export default Onboarding;