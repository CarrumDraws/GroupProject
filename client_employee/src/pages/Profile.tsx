import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { Box, Button, Container, Typography } from '@mui/material';

import Documents from '../components/Documents.tsx';
import LoadingScreen from '../components/LoadingScreen.tsx';
import ProfileField from '../components/ProfileField.tsx';
import EditButton from '../components/EditButton.tsx';
import axiosInstance from '../interceptors/axiosInstance';
import { capitalizeFirstLetter, createEmptyFormObject, formatDate, handleLogout } from '../utils/utilMethods.tsx';
import { AddressForm, AddressFormKeys, ContactForm, ContactFormKeys, EditModeState, EmploymentForm, EmploymentFormKeys, MainForm, MainFormKeys, ProfileForms } from '../types/ProfileForms.tsx';
import { FileData } from '../types/FileData.tsx';
import { Person } from '../types/Person.tsx';

const ProfilePage = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [mainForm, setMainForm] = useState<MainForm>(createEmptyFormObject<MainForm>());
    const [addressForm, setAddressForm] = useState<AddressForm>(createEmptyFormObject<AddressForm>());
    const [contactForm, setContactForm] = useState<ContactForm>(createEmptyFormObject<ContactForm>());
    const [employmentForm, setEmploymentForm] = useState<EmploymentForm>(createEmptyFormObject<EmploymentForm>());
    const [emergencyContactsForm, setEmergencyContactsForm] = useState<Person[]>([createEmptyFormObject<Person>()]);
    const [originalValues, setOriginalValues] = useState<ProfileForms>({
        main: mainForm,
        address: addressForm,
        contact: contactForm,
        employment: employmentForm,
        emergencyContacts: emergencyContactsForm,
    });

    const [pictureKey, setPictureKey] = useState<string>('');
    const [profilePicURL, setProfilePicURL] = useState<string>('');
    const [fileKeys, setFileKeys] = useState<FileData[]>([]);
    const [editMode, setEditMode] = useState<EditModeState>({
        main: false,
        address: false,
        contact: false,
        employment: false,
        emergencyContacts: false
    });

    // initilize data with info fetched
    useEffect(() => {
        const fetchedFileKeys: FileData[] = [];

        const addToFileKeys = (fileKey: string | null, name: string) => {
            if(fileKey && fileKey !== '') {
                fetchedFileKeys.push({ fileKey: fileKey, url: '', filename: '', status: '', name: name });
            }
        }

        const fetchData = async () => {
            try{
                const formResponse = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/employee`);
                const formData = await formResponse.data;
                const profile = formData.profile;

                setMainForm({
                    firstname: profile.name.firstname,
                    middlename: profile.name.middlename,
                    lastname: profile.name.lastname,
                    preferredname: profile.name.preferredname,
                    email: profile.employee_id.email,
                    ssn: profile.ssn,
                    dob: formatDate(profile.dob, '/'),
                    gender: profile.gender,
                    picture: profile.picture
                });

                setAddressForm({
                    buildaptnum: profile.address.buildaptnum,
                    street: profile.address.street,
                    city: profile.address.city,
                    state: profile.address.state,
                    zip: profile.address.zip
                });

                setContactForm({
                    cell: profile.phone.cell,
                    work: profile.phone.work
                });

                setEmploymentForm({
                    title: profile.workauth.workauth === 'Other' ? profile.workauth.title : profile.workauth.workauth,
                    startdate: formatDate(profile.workauth.startdate, '/'),
                    enddate: formatDate(profile.workauth.enddate, '/')
                });

                setEmergencyContactsForm([...profile.contacts]);

                setOriginalValues({
                    main: {
                        firstname: profile.name.firstname,
                        middlename: profile.name.middlename,
                        lastname: profile.name.lastname,
                        preferredname: profile.name.preferredname,
                        email: profile.employee_id.email,
                        ssn: profile.ssn,
                        dob: formatDate(profile.dob, '/'),
                        gender: profile.gender,
                        picture: profile.picture // DELETE?
                    },
                    address: {
                        buildaptnum: profile.address.buildaptnum,
                        street: profile.address.street,
                        city: profile.address.city,
                        state: profile.address.state,
                        zip: profile.address.zip
                    },
                    contact:{
                        cell: profile.phone.cell,
                        work: profile.phone.work
                    },
                    employment:{
                        title: profile.workauth.workauth === 'Other' ? profile.workauth.title : profile.workauth.workauth,
                        startdate: formatDate(profile.workauth.startdate, '/'),
                        enddate: formatDate(profile.workauth.enddate, '/')
                    },
                    emergencyContacts: [...profile.contacts]
                });

                setPictureKey(profile.picture);

                const opt = formData.opt;
                const optKeys = {
                    optreciept: opt.optreciept as string | null,
                    optead: opt.optead as string | null,
                    i983: opt.i983 as string[] | null,
                    i20: opt.i20 as string | null,
                    status: opt.status as string | null
                };
                
                // put the file keys of each opt file into fetchedFileKeys
                addToFileKeys(profile.license.licensefile, 'license');
                addToFileKeys(optKeys.optreciept, 'optreciept');
                addToFileKeys(optKeys.optead, 'optead');
                if(optKeys.i983){
                    optKeys.i983.forEach((k, index) => {
                        addToFileKeys(k, `i983-${index + 1}`);
                    });
                }
                addToFileKeys(optKeys.i20, 'i20');

                // update state with populated file keys
                setFileKeys(fetchedFileKeys);
            }catch(e: any) {
                if (e.response && e.response.data && e.response.data.message) {
                    const errorMessage = e.response.data.message;
                    alert('Error fetching personal information: ' + errorMessage);
                }
            }finally{
                setIsLoading(false);
            }
        } 

        fetchData();
    }, []);

    // fetching profile picture as picture file key changes
    useEffect(() => {
        const updateProfilePic = async () => {
            try{
                setIsLoading(true);
                const profilePicResponse = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/file/${pictureKey}`);
                const profilePicData = await profilePicResponse.data;
                setProfilePicURL(profilePicData.url);
            }catch(e : any){
                if (e.response && e.response.data) {
                    const errorMessage = e.response.data;
                    alert('Error fetching profile picture: ' + errorMessage);
                }
            }finally{
                setIsLoading(false);
            }
        }

        if(pictureKey && typeof pictureKey === 'string' && pictureKey !== '') {
            updateProfilePic();
        } 
    }, [pictureKey]);

    useEffect(()=> {

    }, [emergencyContactsForm]);

    const toggleEditMode = (field: keyof EditModeState) => {
        setEditMode(prevState => ({ ...prevState, [field]: !prevState[field] }));
    };

    const removeEmptyEmergencyContacts = (contacts: Person[]) => {
        const filteredEcs = contacts.filter(contact => {
            return !(contact.firstname === '' && contact.middlename === '' && contact.lastname === '' && contact.phone === '' && contact.email === '' && contact.relationship === '');
        });
        setEmergencyContactsForm(filteredEcs);
    };


    const saveChanges = async (field: keyof EditModeState | 'emergencyContacts', data: any) => {
        let processedData: any = {};
        
        // removing empty emergency contacts
        if (field === 'emergencyContacts') {
            removeEmptyEmergencyContacts(data as Person[]);
            // handle the case when there is no non-empty emergency contact left
            if((emergencyContactsForm as Person[]).length < 1) {
                alert('Error saving changes: You need at least one emergency contact.');
                return;
            }
            processedData = new FormData();
            processedData.append('contacts', JSON.stringify(emergencyContactsForm));
        }

        switch(field){
            case 'main':
                Object.keys(mainForm).forEach(key => {
                    const value = (mainForm as MainForm)[key as MainFormKeys];
                    if(key == 'dob') {
                        (processedData as MainForm)[key as MainFormKeys] = formatDate(value, '-');
                    }else{
                        (processedData as MainForm)[key as MainFormKeys] = value.toString();
                    }
                });
                break;
            case 'address':
                Object.keys(addressForm).forEach(key => {
                    const value = (addressForm as AddressForm)[key as AddressFormKeys];
                    (processedData as AddressForm)[key as AddressFormKeys] = value.toString();
                });
                break;
            case 'contact':
                Object.keys(contactForm).forEach(key => {
                    const value = (contactForm as ContactForm)[key as ContactFormKeys];
                    (processedData as ContactForm)[key as ContactFormKeys] = value.toString();
                });
                break;
            case 'employment':
                Object.keys(employmentForm).forEach(key => {
                    const value = (employmentForm as EmploymentForm)[key as EmploymentFormKeys];
                    if(key == 'startdate' || key == 'enddate') {
                        (processedData as EmploymentForm)[key as EmploymentFormKeys] = formatDate(value, '-');
                    }else {
                        (processedData as EmploymentForm)[key as EmploymentFormKeys] = value.toString();
                    }
                });
                break;
        };

        // post the change
        try {
            await axiosInstance.put(`${import.meta.env.VITE_SERVER_URL}/employee/${capitalizeFirstLetter(field)}`, processedData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error : any) {
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                alert('Error saving changes: ' + errorMessage);
            }else if(error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                alert('Error saving changes: ' + errorMessage);
            }
        } finally {
            // set Emergency Contacts as the version without empty ones
            if (field === 'emergencyContacts') {
                setOriginalValues(prev => ({
                    ...prev,
                    emergencies: [...data as Person[]]
                }));
            }else {
                switch (field) {
                    case 'main':
                        setOriginalValues(prev => ({...prev, main: mainForm}));
                        break;
                    case 'address':
                        setOriginalValues(prev => ({...prev, address: addressForm}));
                        break;
                    case 'contact':
                        setOriginalValues(prev => ({...prev, contact: contactForm}));
                        break;
                    case 'employment':
                        setOriginalValues(prev => ({...prev, employment: employmentForm}));
                        break;
                }
            }

            toggleEditMode(field as keyof EditModeState);
        }
    };

    const cancelChanges = (field: keyof EditModeState | 'emergencyContacts') => {
        if (window.confirm("Do you want to discard the changes in the section?")) {
            if (field === 'emergencyContacts') {              
                originalValues.emergencyContacts.forEach((originalEc, index) => {
                    setEmergencyContactsForm((prevEcs) => {
                        const newEmergencies = [...prevEcs];
                        newEmergencies[index] = originalEc;
                        return newEmergencies;
                    });
                    removeEmptyEmergencyContacts(emergencyContactsForm);
                });
            } else {
                switch (field) {
                    case 'main':
                        setMainForm(originalValues.main);
                        break;
                    case 'address':
                        setAddressForm(originalValues.address);
                        break;
                    case 'contact':
                        setContactForm(originalValues.contact);
                        break;
                    case 'employment':
                        setEmploymentForm(originalValues.employment);
                        break;
                }
            }

            // toggle the edit mode back
            setEditMode(prevState => ({ ...prevState, [field]: false }));
        }
    };

    const addEmergencyContact = () => {
        const newEmergency: Person = {
            firstname: '',
            middlename: '',
            lastname: '',
            phone: '',
            email: '',
            relationship: '',
            _id: uuidv4()
        };

        setEmergencyContactsForm((prevEmergencies) => [...prevEmergencies, newEmergency]);
    };

    const handleDeleteEmergency = (id: string) => {
        if (window.confirm("Are you sure you want to delete this emergency contact?")) {
            setEmergencyContactsForm((prevEmergencies) => prevEmergencies.filter((emergency) => emergency._id !== id));
        }
    };

    const updateEmergencyContact = (updatedEc: Person, index: number) => {
        setEmergencyContactsForm((prevEcs) => {
            const newEcs = [...prevEcs];
            newEcs[index] = updatedEc;
            return newEcs;
        });
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Box sx={{ width: '80%' }}>
                    <Typography paddingTop='1rem' fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Name</Typography>
                    <form>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Box>
                                <ProfileField
                                    label="First Name"
                                    type='text'
                                    name='firstname'
                                    value={mainForm.firstname}
                                    onChange={(e) => setMainForm({ ...mainForm, firstname: e.target.value })}
                                    editMode={editMode.main}
                                />

                                <ProfileField
                                    label="Middle Name"
                                    type='text'
                                    name='middlename'
                                    value={mainForm.middlename}
                                    onChange={(e) => setMainForm({ ...mainForm, middlename: e.target.value })}
                                    editMode={editMode.main}
                                />

                                <ProfileField
                                    label="Last Name"
                                    type='text'
                                    name='lastname'
                                    value={mainForm.lastname}
                                    onChange={(e) => setMainForm({ ...mainForm, lastname: e.target.value })}
                                    editMode={editMode.main}
                                />

                                <ProfileField
                                    label="Preferred Name"
                                    type='text'
                                    name='preferredname'
                                    value={mainForm.preferredname}
                                    onChange={(e) => setMainForm({ ...mainForm, preferredname: e.target.value })}
                                    editMode={editMode.main}
                                />
                            </Box>
                            <Box>
                                <ProfileField
                                    label="Email"
                                    type='email'
                                    name='email'
                                    value={mainForm.email}
                                    onChange={(e) => setMainForm({ ...mainForm, email: e.target.value })}
                                    editMode={editMode.main}
                                />
                                <ProfileField
                                    label="SSN"
                                    type='text'
                                    name='ssn'
                                    value={mainForm.ssn}
                                    onChange={(e) => setMainForm({ ...mainForm, ssn: e.target.value })}
                                    editMode={editMode.main}
                                />
                                <ProfileField
                                    label="Date of Birth"
                                    type='date'
                                    name='dob'
                                    value={mainForm.dob}
                                    onChange={(e) => setMainForm({...mainForm, ['dob']: e.target.value })}
                                    editMode={editMode.main}
                                />

                                <ProfileField
                                    label="Gender"
                                    type="text"
                                    name='gender'
                                    value={mainForm.gender}
                                    onChange={(e) => setMainForm({ ...mainForm, gender: e.target.value })}
                                    editMode={editMode.main}
                                />
                            </Box>
                            
                            <EditButton
                                editMode={editMode.main}
                                saveChanges ={() => saveChanges('main', mainForm)}
                                cancelChanges={() => cancelChanges('main')}
                                toggleEditMode={() => toggleEditMode('main')}
                            />
                        </Box>
                    </form>

                    <hr />

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Address</Typography>
                    <form>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Box>
                                <ProfileField
                                    label="Building/apt #"
                                    type='text'
                                    name='buildaptnum'
                                    value={addressForm.buildaptnum}
                                    onChange={(e) => setAddressForm({ ...addressForm, buildaptnum: e.target.value })}
                                    editMode={editMode.address}
                                />
                                <ProfileField
                                    label="Street Name"
                                    type='text'
                                    name='street'
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                    editMode={editMode.address}
                                />
                            </Box>
                            <Box>
                                <ProfileField
                                    label="City"
                                    type='text'
                                    name='city'
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                    editMode={editMode.address}
                                />
                                <ProfileField
                                    label="State"
                                    type='text'
                                    name='state'
                                    value={addressForm.state}
                                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                    editMode={editMode.address}
                                />
                                <ProfileField
                                    label="Zip"
                                    type='text'
                                    name='zip'
                                    value={addressForm.zip}
                                    onChange={(e) => setAddressForm({ ...addressForm, zip: e.target.value })}
                                    editMode={editMode.address}
                                />
                            </Box>
                            
                            <EditButton
                                editMode={editMode.address}
                                saveChanges ={() => saveChanges('address', addressForm)}
                                cancelChanges={() => cancelChanges('address')}
                                toggleEditMode={() => toggleEditMode('address')}
                            />
                        </Box>
                    </form>

                    <hr />

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Contact Info</Typography>
                    <form>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Box>
                                <ProfileField
                                    label="Cell Phone Number"
                                    type='text'
                                    name='cell'
                                    value={contactForm.cell}
                                    onChange={(e) => setContactForm({ ...contactForm, cell: e.target.value })}
                                    editMode={editMode.contact}
                                />

                                <ProfileField
                                    label="Work Phone Number"
                                    type='text'
                                    name='work'
                                    value={contactForm.work}
                                    onChange={(e) => setContactForm({ ...contactForm, work: e.target.value })}
                                    editMode={editMode.contact}
                                />
                            </Box>

                            <EditButton
                                editMode={editMode.contact}
                                saveChanges ={() => saveChanges('contact', contactForm)}
                                cancelChanges={() => cancelChanges('contact')}
                                toggleEditMode={() => toggleEditMode('contact')}
                            />
                        </Box>
                    </form>

                    <hr />

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Employment</Typography>
                    <form>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Box>
                                <ProfileField
                                    label="Visa Title"
                                    type='text'
                                    name='title'
                                    value={employmentForm.title}
                                    onChange={(e) => setEmploymentForm({ ...employmentForm, title: e.target.value })}
                                    editMode={editMode.employment}
                                />

                                <ProfileField
                                    label="Start Date"
                                    type='date'
                                    name='startdate'
                                    value={employmentForm.startdate}
                                    onChange={(e) => setEmploymentForm({...employmentForm, ['startdate']: e.target.value})}
                                    editMode={editMode.employment}
                                />

                                <ProfileField
                                    label="End Date"
                                    type='date'
                                    name='enddate'
                                    value={employmentForm.enddate}
                                    onChange={(e) => setEmploymentForm({...employmentForm, ['enddate']: e.target.value})}
                                    editMode={editMode.employment}
                                />
                            </Box>

                            <EditButton
                                editMode={editMode.employment}
                                saveChanges ={() => saveChanges('employment', employmentForm)}
                                cancelChanges={() => cancelChanges('employment')}
                                toggleEditMode={() => toggleEditMode('employment')}
                            />
                        </Box>
                    </form>

                    <hr />

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Emergency Contact</Typography>
                    <form>
                        {emergencyContactsForm && emergencyContactsForm.map((ec, index) => (
                            <Box key={ec._id + index} paddingBottom='1rem'>
                                <Typography fontSize='1rem'>Emergency Contact {index + 1}</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Box>
                                        <ProfileField
                                            label="First Name"
                                            type='text'
                                            name='firstname'
                                            value={ec.firstname}
                                            onChange={(e) => updateEmergencyContact({ ...ec, firstname: e.target.value }, index)}
                                            editMode={editMode.emergencyContacts}
                                        />

                                        <ProfileField
                                            label="Middle Name"
                                            type='text'
                                            name='middlename'
                                            value={ec.middlename}
                                            onChange={(e) => updateEmergencyContact({ ...ec, middlename: e.target.value }, index)}
                                            editMode={editMode.emergencyContacts}
                                        />

                                        <ProfileField
                                            label="Last Name"
                                            type='text'
                                            name='lastname'
                                            value={ec.lastname}
                                            onChange={(e) => updateEmergencyContact({ ...ec, lastname: e.target.value }, index)}
                                            editMode={editMode.emergencyContacts}
                                        />
                                    </Box>

                                    <Box>
                                        <ProfileField
                                            label="Phone"
                                            type='text'
                                            name='phone'
                                            value={ec.phone}
                                            onChange={(e) => updateEmergencyContact({ ...ec, phone: e.target.value }, index)}
                                            editMode={editMode.emergencyContacts}
                                        />

                                        <ProfileField
                                            label="Email"
                                            type='email'
                                            name='email'
                                            value={ec.email}
                                            onChange={(e) => updateEmergencyContact({ ...ec, email: e.target.value }, index)}
                                            editMode={editMode.emergencyContacts}
                                        />

                                        <ProfileField
                                            label="Relationship"
                                            type='text'
                                            name='relationship'
                                            value={ec.relationship}
                                            onChange={(e) => updateEmergencyContact({ ...ec, relationship: e.target.value }, index)}
                                            editMode={editMode.emergencyContacts}
                                        />
                                    </Box>

                                    <Box sx={{ width: '8rem' }}></Box>

                                    {emergencyContactsForm.length > 1 && (
                                        <Button onClick={() => handleDeleteEmergency(ec._id)}>Delete</Button>
                                    )}
                                </Box>
                            </Box>
                        ))}

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            {editMode.emergencyContacts ? (
                                <>
                                    <Button onClick={() => saveChanges('emergencyContacts', emergencyContactsForm)}>Save</Button>
                                    <Button onClick={addEmergencyContact}>Add Emergency Contact</Button>
                                    <Button onClick={() => cancelChanges('emergencyContacts')} sx={{ color: 'red', borderColor: 'red'}} >Cancel</Button>
                                </>
                            ) : (
                                <Button onClick={() => toggleEditMode('emergencyContacts')}>Edit</Button>
                            )}
                        </Box>
                    </form>

                    <hr />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20%' }}>
                    {profilePicURL && profilePicURL !== '' && (
                        <Box sx={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <img 
                                src={profilePicURL}
                                alt="Profile Pic" 
                                style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
                            />
                        </Box>
                    )}

                    <Documents fileKeys={fileKeys} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: '3rem' }}>
                <Button onClick={handleLogout} sx={{ color: 'red', borderColor: 'red', fontSize: '1rem', paddingLeft: '1.5rem' }}>
                    Log Out
                </Button>
            </Box>
        </Container>
    );
};

export default ProfilePage;