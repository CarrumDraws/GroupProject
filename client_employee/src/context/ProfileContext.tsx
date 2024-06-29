import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import axiosInstance from '../interceptors/axiosInstance';
import EmployeeInfo from '../types/EmployeeInfo.tsx';
import { formatDate } from '../utils/utilMethods.tsx';
import { Person } from '../types/Person.tsx';

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
    id: string;
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
    address: AddressForm;
    updateAddress: (updatedAddress: AddressForm) => void;
    contact: ContactForm;
    updateContact: (updatedContact: ContactForm) => void;
    employment: EmploymentForm;
    updateEmployment: (updatedEmployment: EmploymentForm) => void;
    emergencies: EmergencyForm[];
    updateEmergency: (updatedEmergency: EmergencyForm, index: number) => void;
    addEmergency: (newEmergency: EmergencyForm) => void;
    deleteEmergency: (id: string) => void;
    files: string[];
    isLoading: boolean;
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
const initialNameValues: NameForm = {
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    ssn: '',
    dob: today,
    gender: ''
};

const initialAddressValues: AddressForm = {
    apt: '',
    street: '',
    city: '',
    state: '',
    zip: ''
};

const initialContactValues: ContactForm = {
    cell: '',
    work: ''
};

const initialEmployment: EmploymentForm = {
    visa: '',
    start: today,
    end: today
};

const initialEmergency: EmergencyForm = {
    id: uuidv4(),
    emergencyFirstName: '',
    emergencyMiddleName: '',
    emergencyLastName: '',
    emergencyPhone: '',
    emergencyEmail: '',
    relationship: ''
};

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
    const [name, setName] = useState<NameForm>(initialNameValues);
    const [address, setAddress] = useState<AddressForm>(initialAddressValues);
    const [contact, setContact] = useState<ContactForm>(initialContactValues);
    const [employment, setEmployment] = useState<EmploymentForm>(initialEmployment);
    const [emergencies, setEmergencies] = useState<EmergencyForm[]>([initialEmergency]);
    const [files, setFiles] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`${import.meta.env.VITE_SERVER_URL}/employee`);
                const data = await response.data;
                const profile: EmployeeInfo = data.profile;

                setName({
                    firstName: profile.name.firstname,
                    middleName: profile.name.middlename,
                    lastName: profile.name.lastname,
                    email: profile.employee_id.email,
                    ssn: profile.ssn ? profile.ssn : '',
                    dob: formatDate(profile.dob ? profile.dob : today, '-'),
                    gender: profile.gender
                });

                setAddress({
                    apt: profile.address.buildaptnum ? profile.address.buildaptnum : '',
                    street: profile.address.street,
                    city: profile.address.city,
                    state: profile.address.state,
                    zip: profile.address.zip
                });

                setContact({
                    cell: profile.phone.cell ? profile.phone.cell : '',
                    work: profile.phone.work ? profile.phone.work : ''
                });

                setEmployment({
                    visa: profile.citizenshiptype,
                    start: formatDate(profile.workauth.startdate || today, '-'),
                    end: formatDate(profile.workauth.enddate || today, '-')
                });

                if (profile.contacts.length > 0) {
                    const emergencyContacts: EmergencyForm[] = profile.contacts.map((contact: Person) => ({
                        id: uuidv4(),
                        emergencyFirstName: contact.firstname,
                        emergencyMiddleName: contact.middlename,
                        emergencyLastName: contact.lastname,
                        emergencyPhone: contact.phone,
                        emergencyEmail: contact.email,
                        relationship: contact.relationship
                    }));

                    setEmergencies(emergencyContacts);

                    const fileArr : string[] = [];
                    const profilePic = profile.picture;
                    if(profilePic) {
                        fileArr.push(profilePic.toString());
                    }

                    const licenseFile = profile.license.licensefile;
                    if(licenseFile) {
                        fileArr.push(licenseFile.toString());
                    }

                    setFiles(fileArr);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const updateName = (updatedName: NameForm) => {
        setName(updatedName);
    };

    const updateAddress = (updatedAddress: AddressForm) => {
        setAddress(updatedAddress);
    };

    const updateContact = (updatedContact: ContactForm) => {
        setContact(updatedContact);
    };

    const updateEmployment = (updatedEmployment: EmploymentForm) => {
        setEmployment(updatedEmployment);
    };

    const updateEmergency = (updatedEmergency: EmergencyForm, index: number) => {
        setEmergencies((prevEmergencies) => {
            const newEmergencies = [...prevEmergencies];
            newEmergencies[index] = updatedEmergency;
            return newEmergencies;
        });
    };

    const addEmergency = (newEmergency: EmergencyForm) => {
        setEmergencies((prevEmergencies) => [...prevEmergencies, newEmergency]);
    };

    const deleteEmergency = (id: string) => {
        setEmergencies((prevEmergencies) => prevEmergencies.filter((emergency) => emergency.id !== id));
    };

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
                emergencies,
                updateEmergency,
                addEmergency,
                deleteEmergency,
                files,
                isLoading
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};