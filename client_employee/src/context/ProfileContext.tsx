import { ReactNode, createContext, useContext, useState } from 'react';

export interface NameForm {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    ssn: string;
    dob: string;
    gender: string;
}

export interface AddressForm {
    apt: string;
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface ContactForm {
    cell: string;
    work: string;
}

export interface EmploymentForm {
    visa: string;
    start: string;
    end: string;
}

export interface EmergencyForm {
    emergencyFirstName: string;
    emergencyMiddleName: string;
    emergencyLastName: string;
    emergencyPhone: string;
    emergencyEmail: string;
    relationship: string;
}

interface ProfileContextType {
    name: NameForm;
    updateName: (updateName: NameForm) => void;

    address: AddressForm
    updateAddress: (updatedAddress: AddressForm) => void;

    contact: ContactForm;
    updateContact: (updatedContact: ContactForm) => void;

    employment: EmploymentForm;
    updateEmployment: (updatedEmployment: EmploymentForm) => void;

    emergency: EmergencyForm;
    updateEmergency: (updatedEmergency: EmergencyForm) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

interface ProfileProviderProps {
    children: ReactNode;
}

const today: string = new Date().toString();
const initialNameValues = {
    firstName: 'Sam',
    middleName: '',
    lastName: '',
    email: 'sam@gmail.com',
    ssn: '',
    dob: today,
    gender: ''
};

const initialAddressValues = {
    apt: '',
    street: '',
    city: '',
    state: '',
    zip: ''
}

const initialContactValues = {
    cell: '',
    work: ''
}

const initialEmployment = {
    visa: '',
    start: today,
    end: today
}

const initialEmergency = {
    emergencyFirstName: '',
    emergencyMiddleName: '',
    emergencyLastName: '',
    emergencyPhone: '',
    emergencyEmail: '',
    relationship: ''
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
    const [name, setName] = useState(initialNameValues);
    const [address, setAddress] = useState(initialAddressValues);
    const [contact, setContact] = useState(initialContactValues);
    const [employment, setEmployment] = useState(initialEmployment);
    const [emergency, setEmergency] = useState(initialEmergency);

    const updateName = (updatedName: NameForm) => {
        setName(updatedName);
    }

    const updateAddress = (updatedAddress: AddressForm) => {
        setAddress(updatedAddress);
    }

    const updateContact = (updatedContact: ContactForm) => {
        setContact(updatedContact);
    }

    const updateEmployment = (updatedEmployment: EmploymentForm) => {
        setEmployment(updatedEmployment);
    }

    const updateEmergency = (updatedEmergency: EmergencyForm) => {
        setEmergency(updatedEmergency);
    }

    return (
        <ProfileContext.Provider
            value={{
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
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
}