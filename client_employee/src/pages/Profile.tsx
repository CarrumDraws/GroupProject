import { useState, useEffect } from "react";

import { Box, Button, Container, Typography } from "@mui/material";

import { useProfile } from '../context/ProfileContext.tsx';
import { profileForms }  from '../components/ProfileForms.tsx';
import ProfileField from '../components/ProfileField.tsx';

function Profile() {
    const {
        name,
        updateName,
        address,
        updateAddress,
        contact,
        updateContact,
        employment,
        updateEmployment,
        emergency,
        updateEmergency
    } = useProfile();

    const [nameFormValues, setNameFormValues] = useState(name);
    const [nameEditMode, setNameEditMode] = useState(false);

    const [addressFormValues, setAddressFormValues] = useState(address);
    const [addressEditMode, setAddressEditMode] = useState(false);

    const [contactFormValues, setContactFormValues] = useState(contact);
    const [contactEditMode, setContactEditMode] = useState(false);

    const [employmentFormValues, setEmploymentFormValues] = useState(employment);
    const [employmentEditMode, setEmploymentEditMode] = useState(false);

    const [emergencyFormValues, setEmergencyFormValues] = useState(emergency);
    const [emergencyEditMode, setEmergencyEditMode] = useState(false);

    const nameForm = profileForms(nameFormValues);
    const addressForm = profileForms(addressFormValues);
    const contactForm = profileForms(contactFormValues);
    const employmentForm = profileForms(employmentFormValues);
    const emergencyForm = profileForms(emergencyFormValues);

    useEffect(() => {
        if(!nameEditMode) {
            setNameFormValues(name);
        }

        if(!addressEditMode) {
            setAddressFormValues(address);
        }

        if(!contactEditMode) {
            setContactFormValues(contact);
        }

        if(!employmentEditMode) {
            setEmploymentFormValues(employment);
        }

        if(!emergencyEditMode) {
            setEmergencyFormValues(emergency);
        }
    },[name, nameEditMode, address, addressEditMode, contact, contactEditMode, employment, employmentEditMode, emergency, emergencyEditMode]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    // Toggle Edit Mode for the forms
    const toggleNameEditMode = () => {
        setNameEditMode(!nameEditMode);
    }

    const toggleAddressEditMode = () => {
        setAddressEditMode(!addressEditMode);
    }

    const toggleContactEditMode = () => {
        setContactEditMode(!contactEditMode);
    }

    const toggleEmploymentEditMode = () => {
        setEmploymentEditMode(!employmentEditMode);
    }

    const toggleEmergencyEditMode = () => {
        setEmergencyEditMode(!emergencyEditMode);
    }

    // Handle Save function for the forms
    const handleSaveNameEdit = () => {
        updateName(nameFormValues);
        toggleNameEditMode();
    }

    const handleSaveAddressEdit = () => {
        updateAddress(addressFormValues);
        toggleAddressEditMode();
    }

    const handleSaveContactEdit = () => {
        updateContact(contactFormValues);
        toggleContactEditMode();
    }

    const handleSaveEmploymentEdit = () => {
        updateEmployment(employmentFormValues);
        toggleEmploymentEditMode();
    }

    const handleSaveEmergencyEdit = () => {
        updateEmergency(emergencyFormValues);
        toggleEmergencyEditMode();
    }

    // Handle the cancel function for the forms
    const handleNameCancel = () => {
        const confirmDiscard = window.confirm('Do you want to discard all of your changes for the Name Form?');
        if(confirmDiscard) {
            nameForm.resetValues(name);
            toggleNameEditMode();
        }
    };

    const handleAddressCancel = () => {
        const confirmDiscard = window.confirm('Do you want to discard all of your changes for the Address Form?');
        if(confirmDiscard) {
            addressForm.resetValues(address);
            toggleAddressEditMode();
        }
    }

    const handleContactCancel = () => {
        const confirmDiscard = window.confirm('Do you want to discard all of your changes for the Contact Information Form?');
        if(confirmDiscard) {
            contactForm.resetValues(contact);
            toggleContactEditMode();
        }
    }

    const handleEmploymentCancel = () => {
        const confirmDiscard = window.confirm('Do you want to discard all of your changes for the Employment Form?');
        if(confirmDiscard) {
            employmentForm.resetValues(employment);
            toggleEmploymentEditMode();
        }
    }

    const handleEmergencyCancel = () => {
        const confirmDiscard = window.confirm('Do you want to discard all of your changes for the Emergency Contact Form?');
        if(confirmDiscard) {
            emergencyForm.resetValues(emergency);
            toggleEmergencyEditMode();
        }
    }

    return (
        <Container>
            <Box sx={{ display:'flex', flexDirection:'row' }}>
                <Box sx={{ width: '80%' }}>
                    <Typography paddingTop='1rem' fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Name</Typography>

                    <form>
                        <Box sx={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                            <Box>
                                <ProfileField
                                    label="First Name"
                                    type='text'
                                    name='firstName'
                                    value={nameForm.values.firstName}
                                    onChange={nameForm.handleChange}
                                    editMode={nameEditMode}
                                />
                                    
                                <ProfileField
                                    label="Middle Name"
                                    type='text' name='middleName'
                                    value={nameForm.values.middleName}
                                    onChange={nameForm.handleChange}
                                    editMode={nameEditMode}
                                />

                                <ProfileField
                                    label="Last Name"
                                    type='text'
                                    name='lastName'
                                    value={nameForm.values.lastName}
                                    onChange={nameForm.handleChange}
                                    editMode={nameEditMode}
                                />
                            </Box>

                            <Box>
                                <ProfileField
                                    label="Email"
                                    type='email'
                                    name='email'
                                    value={nameForm.values.email}
                                    onChange={nameForm.handleChange}
                                    editMode={nameEditMode}
                                />

                                <ProfileField
                                    label="SSN"
                                    type='text'
                                    name='ssn'
                                    value={nameForm.values.ssn}
                                    onChange={nameForm.handleChange}
                                    editMode={nameEditMode}
                                />

                                <ProfileField
                                    label="Date of Birth"
                                    type='date'
                                    name='dob'
                                    value={nameForm.values.dob}
                                    onChange={nameForm.handleChange}
                                    editMode={nameEditMode}
                                />

                                <ProfileField
                                    label="Gender"
                                    type="text"
                                    name='gender'
                                    value={nameForm.values.gender}
                                    onChange={nameForm.handleChange}
                                    editMode={nameEditMode}
                                />
                            </Box>
                            {nameEditMode ?
                                <Box sx={{ display:'flex', displayDirection: 'column' }}>
                                    <Button onClick={handleSaveNameEdit}>Save</Button>
                                    <Button onClick={handleNameCancel}>Cancel</Button>
                                </Box> :
                                <Button onClick={toggleNameEditMode}>Edit</Button>}
                        </Box>
                    </form>

                    <hr/>

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Address</Typography>

                    <form>
                        <Box sx={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                            <Box>
                                <ProfileField
                                    label="Building/apt #"
                                    type='text'
                                    name='apt'
                                    value={addressForm.values.apt}
                                    onChange={addressForm.handleChange}
                                    editMode={addressEditMode}
                                />

                                <ProfileField
                                    label="Street Name"
                                    type='text'
                                    name='street'
                                    value={addressForm.values.street}
                                    onChange={addressForm.handleChange}
                                    editMode={addressEditMode}
                                />
                            </Box>

                            <Box>
                                <ProfileField
                                    label="City"
                                    type='text'
                                    name='city'
                                    value={addressForm.values.city}
                                    onChange={addressForm.handleChange}
                                    editMode={addressEditMode}
                                />

                                <ProfileField
                                    label="State"
                                    type='text'
                                    name='state'
                                    value={addressForm.values.state}
                                    onChange={addressForm.handleChange}
                                    editMode={addressEditMode}
                                />

                                <ProfileField
                                    label="Zip"
                                    type='text'
                                    name='zip'
                                    value={addressForm.values.zip}
                                    onChange={addressForm.handleChange}
                                    editMode={addressEditMode}
                                />
                            </Box>
                            {addressEditMode ?
                                    <Box sx={{ display:'flex', displayDirection: 'column' }}>
                                        <Button onClick={handleSaveAddressEdit}>Save</Button>
                                        <Button onClick={handleAddressCancel}>Cancel</Button>
                                    </Box> :
                                    <Button onClick={toggleAddressEditMode}>Edit</Button>}
                        </Box>
                    </form>

                    <hr/>

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Contact Info</Typography>

                    <form>
                        <Box sx={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                            <ProfileField
                                label="Cell Phone Number"
                                type='text'
                                name='cell'
                                value={contactForm.values.cell}
                                onChange={contactForm.handleChange}
                                editMode={contactEditMode}
                            />

                            <ProfileField
                                label="Work Phone Number"
                                type='text'
                                name='work'
                                value={contactForm.values.work}
                                onChange={contactForm.handleChange}
                                editMode={contactEditMode}
                            />

                            {contactEditMode ?
                                <Box sx={{ display:'flex', displayDirection: 'column' }}>
                                    <Button onClick={handleSaveContactEdit}>Save</Button>
                                    <Button onClick={handleContactCancel}>Cancel</Button>
                                </Box> :
                                <Button onClick={toggleContactEditMode}>Edit</Button>}
                        </Box>
                    </form>

                    <hr/>

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Employment</Typography>
                    
                    <form>
                        <Box sx={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                            <ProfileField
                                label="Visa Title"
                                type='text'
                                name='visa'
                                value={employmentForm.values.visa}
                                onChange={employmentForm.handleChange}
                                editMode={employmentEditMode}
                            />

                            <Box>
                                <ProfileField
                                    label="Start Date"
                                    type='date'
                                    name='start'
                                    value={employmentForm.values.start}
                                    onChange={employmentForm.handleChange}
                                    editMode={employmentEditMode}
                                />

                                <ProfileField
                                    label="End Date"
                                    type='date'
                                    name='end'
                                    value={employmentForm.values.end}
                                    onChange={employmentForm.handleChange}
                                    editMode={employmentEditMode}
                                />
                            </Box>

                            {employmentEditMode ?
                                <Box sx={{ display:'flex', displayDirection: 'column' }}>
                                    <Button onClick={handleSaveEmploymentEdit}>Save</Button>
                                    <Button onClick={handleEmploymentCancel}>Cancel</Button>
                                </Box> :
                                <Button onClick={toggleEmploymentEditMode}>Edit</Button>}
                        </Box>
                    </form>

                    <hr/>

                    <Typography fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Emergency Contact</Typography>
                    
                    <form>
                        <Box sx={{ display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
                            <Box>
                                <ProfileField
                                    label="First Name"
                                    type='text'
                                    name='emergencyFirstName'
                                    value={emergencyForm.values.emergencyFirstName}
                                    onChange={emergencyForm.handleChange}
                                    editMode={emergencyEditMode}
                                />

                                <ProfileField
                                    label="Middle Name"
                                    type='text'
                                    name='emergencyMiddleName'
                                    value={emergencyForm.values.emergencyMiddleName}
                                    onChange={emergencyForm.handleChange}
                                    editMode={emergencyEditMode}
                                />

                                <ProfileField
                                    label="Last Name"
                                    type='text'
                                    name='emergencyLastName'
                                    value={emergencyForm.values.emergencyLastName}
                                    onChange={emergencyForm.handleChange}
                                    editMode={emergencyEditMode}
                                />
                            </Box>

                            <Box>
                                <ProfileField
                                    label="Phone"
                                    type='text'
                                    name='emergencyPhone'
                                    value={emergencyForm.values.emergencyPhone}
                                    onChange={emergencyForm.handleChange}
                                    editMode={emergencyEditMode}
                                />

                                <ProfileField
                                    label="Email"
                                    type='email'
                                    name='emergencyEmail'
                                    value={emergencyForm.values.emergencyEmail}
                                    onChange={emergencyForm.handleChange}
                                    editMode={emergencyEditMode}
                                />

                                <ProfileField
                                    label="Relationship"
                                    type='text'
                                    name='relationship'
                                    value={emergencyForm.values.relationship}
                                    onChange={emergencyForm.handleChange}
                                    editMode={emergencyEditMode}
                                />
                            </Box>

                            {emergencyEditMode ?
                                <Box sx={{ display:'flex', displayDirection: 'column' }}>
                                    <Button onClick={handleSaveEmergencyEdit}>Save</Button>
                                    <Button onClick={handleEmergencyCancel}>Cancel</Button>
                                </Box> :
                                <Button onClick={toggleEmergencyEditMode}>Edit</Button>}
                        </Box>

                        <hr/>
                    </form>
                </Box>
                <Box sx={{ display:'flex', justifyContent:'center', width: '20%' }}>
                    <Typography paddingTop='1rem' fontSize='1.5rem' color='#8696A7' sx={{ textDecoration: 'underline' }}>Documents</Typography>
                </Box>
            </Box>
            <Box sx={{ display:'flex', justifyContent:'center', mt: '3rem' }}>
                <Button onClick={handleLogout} sx={{ color:'red', borderColor:'red', fontSize: '1rem', paddingLeft: '1.5rem' }}>
                    Log Out
                </Button>
            </Box>
        </Container>
    );
}

export default Profile;