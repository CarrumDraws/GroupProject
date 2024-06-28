import { useState, useEffect, ChangeEvent } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';

import ProfileField from '../components/ProfileField.tsx';
import Documents from '../components/Documents.tsx';
import axiosInstance from '../interceptors/axiosInstance';
import { useProfile, EmergencyForm } from '../context/ProfileContext.tsx';
import { v4 as uuidv4 } from 'uuid';
import { formatDate, handleLogout } from '../utils/utilMethods.tsx';

type EditModeState = {
    name: boolean;
    address: boolean;
    contact: boolean;
    employment: boolean;
    emergencies: boolean;
};

const ProfilePage = () => {
    const {
        name, updateName,
        address, updateAddress,
        contact, updateContact,
        employment, updateEmployment,
        emergencies, updateEmergency, addEmergency, deleteEmergency,
        isLoading
    } = useProfile();

    const [initialState, setInitialState] = useState({
        name,
        address,
        contact,
        employment,
        emergencies
    });

    useEffect(() => {
        if (!isLoading) {
            setInitialState({
                name,
                address,
                contact,
                employment,
                emergencies
            });
        }
    }, [isLoading]);

    const [editMode, setEditMode] = useState<EditModeState>({
        name: false,
        address: false,
        contact: false,
        employment: false,
        emergencies: false
    });

    const toggleEditMode = (field: keyof EditModeState) => {
        setEditMode(prevState => ({ ...prevState, [field]: !prevState[field] }));
    };

    const removeEmptyEmergencyContacts = (contacts: EmergencyForm[]) => {
        return contacts.filter(contact => {
            return !(contact.emergencyFirstName === '' && contact.emergencyMiddleName === '' && contact.emergencyLastName === '' && contact.emergencyPhone === '' && contact.emergencyEmail === '' && contact.relationship === '');
        });
    };

    const saveChanges = async (field: keyof EditModeState | 'emergencies', data: any) => {
        if (field === 'emergencies') {
            data = removeEmptyEmergencyContacts(data);
        }
        try {
            const response = await axiosInstance.post(`${import.meta.env.VITE_SERVER_URL}/employee/${field}`, data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            if (field === 'emergencies') {
                setInitialState(prevState => ({
                    ...prevState,
                    emergencies: [...data]
                }));
            }
            toggleEditMode(field as keyof EditModeState);
        }
    };

    const cancelChanges = (field: keyof EditModeState | 'emergencies') => {
        if (window.confirm("Do you want to discard the changes?")) {
            if (field === 'emergencies') {
                const filteredEmergencies = removeEmptyEmergencyContacts(initialState.emergencies);
                setInitialState(prevState => ({
                    ...prevState,
                    emergencies: [...filteredEmergencies]
                }));
                while (emergencies.length > filteredEmergencies.length) {
                    emergencies.pop();
                }
                emergencies.forEach((contact, index) => {
                    updateEmergency(contact, index);
                });
            } else {
                switch (field) {
                    case 'name':
                        updateName(initialState.name);
                        break;
                    case 'address':
                        updateAddress(initialState.address);
                        break;
                    case 'contact':
                        updateContact(initialState.contact);
                        break;
                    case 'employment':
                        updateEmployment(initialState.employment);
                        break;
                }
            }
            setEditMode(prevState => ({ ...prevState, [field]: false }));
        }
    };

    const addEmergencyContact = () => {
        const newEmergency: EmergencyForm = {
            id: uuidv4(),
            emergencyFirstName: '',
            emergencyMiddleName: '',
            emergencyLastName: '',
            emergencyPhone: '',
            emergencyEmail: '',
            relationship: ''
        };
        addEmergency(newEmergency);
    };

    const handleDeleteEmergency = (id: string) => {
        if (window.confirm("Are you sure you want to delete this emergency contact?")) {
            deleteEmergency(id);
        }
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
        const value = e.target.value;
        let formattedDate = value;

        if (value.length === 8 && !value.includes('-')) {
            formattedDate = formatDate(value, '-');
        }

        updateName({ ...name, [field]: formattedDate });
    };

    if (isLoading) return <Typography>Loading...</Typography>;

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
                                    name='firstName'
                                    value={name.firstName}
                                    onChange={(e) => updateName({ ...name, firstName: e.target.value })}
                                    editMode={editMode.name}
                                />
                                <ProfileField
                                    label="Middle Name"
                                    type='text'
                                    name='middleName'
                                    value={name.middleName}
                                    onChange={(e) => updateName({ ...name, middleName: e.target.value })}
                                    editMode={editMode.name}
                                />
                                <ProfileField
                                    label="Last Name"
                                    type='text'
                                    name='lastName'
                                    value={name.lastName}
                                    onChange={(e) => updateName({ ...name, lastName: e.target.value })}
                                    editMode={editMode.name}
                                />
                            </Box>
                            <Box>
                                <ProfileField
                                    label="Email"
                                    type='email'
                                    name='email'
                                    value={name.email}
                                    onChange={(e) => updateName({ ...name, email: e.target.value })}
                                    editMode={editMode.name}
                                />
                                <ProfileField
                                    label="SSN"
                                    type='text'
                                    name='ssn'
                                    value={name.ssn}
                                    onChange={(e) => updateName({ ...name, ssn: e.target.value })}
                                    editMode={editMode.name}
                                />
                                <ProfileField
                                    label="Date of Birth"
                                    type='date'
                                    name='dob'
                                    value={formatDate(name.dob, '-')}
                                    onChange={(e) => handleDateChange(e, 'dob')}
                                    editMode={editMode.name}
                                />
                                <ProfileField
                                    label="Gender"
                                    type="text"
                                    name='gender'
                                    value={name.gender}
                                    onChange={(e) => updateName({ ...name, gender: e.target.value })}
                                    editMode={editMode.name}
                                />
                            </Box>
                            {editMode.name ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button onClick={() => saveChanges('name', name)}>Save</Button>
                                    <Button onClick={() => cancelChanges('name')}>Cancel</Button>
                                </Box>
                            ) : (
                                <Button onClick={() => toggleEditMode('name')}>Edit</Button>
                            )}
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
                                    name='apt'
                                    value={address.apt}
                                    onChange={(e) => updateAddress({ ...address, apt: e.target.value })}
                                    editMode={editMode.address}
                                />
                                <ProfileField
                                    label="Street Name"
                                    type='text'
                                    name='street'
                                    value={address.street}
                                    onChange={(e) => updateAddress({ ...address, street: e.target.value })}
                                    editMode={editMode.address}
                                />
                            </Box>
                            <Box>
                                <ProfileField
                                    label="City"
                                    type='text'
                                    name='city'
                                    value={address.city}
                                    onChange={(e) => updateAddress({ ...address, city: e.target.value })}
                                    editMode={editMode.address}
                                />
                                <ProfileField
                                    label="State"
                                    type='text'
                                    name='state'
                                    value={address.state}
                                    onChange={(e) => updateAddress({ ...address, state: e.target.value })}
                                    editMode={editMode.address}
                                />
                                <ProfileField
                                    label="Zip"
                                    type='text'
                                    name='zip'
                                    value={address.zip}
                                    onChange={(e) => updateAddress({ ...address, zip: e.target.value })}
                                    editMode={editMode.address}
                                />
                            </Box>
                            {editMode.address ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button onClick={() => saveChanges('address', address)}>Save</Button>
                                    <Button onClick={() => cancelChanges('address')}>Cancel</Button>
                                </Box>
                            ) : (
                                <Button onClick={() => toggleEditMode('address')}>Edit</Button>
                            )}
                        </Box>
                    </form>

                    <hr />

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Contact Info</Typography>
                    <form>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <ProfileField
                                label="Cell Phone Number"
                                type='text'
                                name='cell'
                                value={contact.cell}
                                onChange={(e) => updateContact({ ...contact, cell: e.target.value })}
                                editMode={editMode.contact}
                            />
                            <ProfileField
                                label="Work Phone Number"
                                type='text'
                                name='work'
                                value={contact.work}
                                onChange={(e) => updateContact({ ...contact, work: e.target.value })}
                                editMode={editMode.contact}
                            />
                            {editMode.contact ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button onClick={() => saveChanges('contact', contact)}>Save</Button>
                                    <Button onClick={() => cancelChanges('contact')}>Cancel</Button>
                                </Box>
                            ) : (
                                <Button onClick={() => toggleEditMode('contact')}>Edit</Button>
                            )}
                        </Box>
                    </form>

                    <hr />

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Employment</Typography>
                    <form>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <ProfileField
                                label="Visa Title"
                                type='text'
                                name='visa'
                                value={employment.visa}
                                onChange={(e) => updateEmployment({ ...employment, visa: e.target.value })}
                                editMode={editMode.employment}
                            />
                            <Box>
                                <ProfileField
                                    label="Start Date"
                                    type='date'
                                    name='start'
                                    value={formatDate(employment.start, '-')}
                                    onChange={(e) => updateEmployment({ ...employment, start: e.target.value })}
                                    editMode={editMode.employment}
                                />
                                <ProfileField
                                    label="End Date"
                                    type='date'
                                    name='end'
                                    value={formatDate(employment.end, '-')}
                                    onChange={(e) => updateEmployment({ ...employment, end: e.target.value })}
                                    editMode={editMode.employment}
                                />
                            </Box>
                            {editMode.employment ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button onClick={() => saveChanges('employment', employment)}>Save</Button>
                                    <Button onClick={() => cancelChanges('employment')}>Cancel</Button>
                                </Box>
                            ) : (
                                <Button onClick={() => toggleEditMode('employment')}>Edit</Button>
                            )}
                        </Box>
                    </form>

                    <hr />

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Emergency Contact</Typography>
                    <form>
                        {emergencies.map((emergency, index) => (
                            <Box key={emergency.id} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Box>
                                    <ProfileField
                                        label="First Name"
                                        type='text'
                                        name='emergencyFirstName'
                                        value={emergency.emergencyFirstName}
                                        onChange={(e) => updateEmergency({ ...emergency, emergencyFirstName: e.target.value }, index)}
                                        editMode={editMode.emergencies}
                                    />
                                    <ProfileField
                                        label="Middle Name"
                                        type='text'
                                        name='emergencyMiddleName'
                                        value={emergency.emergencyMiddleName}
                                        onChange={(e) => updateEmergency({ ...emergency, emergencyMiddleName: e.target.value }, index)}
                                        editMode={editMode.emergencies}
                                    />
                                    <ProfileField
                                        label="Last Name"
                                        type='text'
                                        name='emergencyLastName'
                                        value={emergency.emergencyLastName}
                                        onChange={(e) => updateEmergency({ ...emergency, emergencyLastName: e.target.value }, index)}
                                        editMode={editMode.emergencies}
                                    />
                                </Box>
                                <Box>
                                    <ProfileField
                                        label="Phone"
                                        type='text'
                                        name='emergencyPhone'
                                        value={emergency.emergencyPhone}
                                        onChange={(e) => updateEmergency({ ...emergency, emergencyPhone: e.target.value }, index)}
                                        editMode={editMode.emergencies}
                                    />
                                    <ProfileField
                                        label="Email"
                                        type='email'
                                        name='emergencyEmail'
                                        value={emergency.emergencyEmail}
                                        onChange={(e) => updateEmergency({ ...emergency, emergencyEmail: e.target.value }, index)}
                                        editMode={editMode.emergencies}
                                    />
                                    <ProfileField
                                        label="Relationship"
                                        type='text'
                                        name='relationship'
                                        value={emergency.relationship}
                                        onChange={(e) => updateEmergency({ ...emergency, relationship: e.target.value }, index)}
                                        editMode={editMode.emergencies}
                                    />
                                </Box>
                                {emergencies.length > 1 && (
                                    <Button onClick={() => handleDeleteEmergency(emergency.id)}>Delete</Button>
                                )}
                            </Box>
                        ))}
                        {editMode.emergencies ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Button onClick={() => saveChanges('emergencies', emergencies)}>Save</Button>
                                <Button onClick={() => cancelChanges('emergencies')}>Cancel</Button>
                                <Button onClick={addEmergencyContact}>Add Emergency Contact</Button>
                            </Box>
                        ) : (
                            <Button onClick={() => toggleEditMode('emergencies')}>Edit</Button>
                        )}
                    </form>

                    <hr />
                </Box>
                <Documents />
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