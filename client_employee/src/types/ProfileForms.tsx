export interface MainForm {
    firstname: string;
    middlename: string;
    lastname: string;
    preferredname: string;
    email: string;
    ssn: string;
    dob: string;
    gender: string;
    picture: string;
}

export interface AddressForm {
    buildaptnum: string;
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
    title: string;
    startdate: string;
    enddate: string;
}

export interface EmergencyForm {
    firstname: string;
    middlename: string;
    lastname: string;
    phone: string;
    email: string;
    relationship: string;
    _id: string;
}

export type EmptyFormObject<T> = {
    [K in keyof T]: '';
};

export interface ProfileForms {
    main: MainForm;
    address: AddressForm;
    contact: ContactForm;
    employment: EmploymentForm;
    emergencyContacts: EmergencyForm[];
}

export type EditModeState = {
    main: boolean;
    address: boolean;
    contact: boolean;
    employment: boolean;
    emergencyContacts: boolean;
};

export interface OPT {
    optreciept: string | null;
    optead: string | null;
    i983: string[] | null;
    i20: string | null;
    status: string;
}