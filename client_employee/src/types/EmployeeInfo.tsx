import { Person } from "./Person";

interface Employee {
    _id: string;
    email: string;
    password: string;
    isHR: boolean;
    __v: number;
}

export interface Name {
    firstname: string;
    middlename: string;
    lastname: string;
    preferredname: string;
    _id: string;
}

export interface Address {
    buildaptnum: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    _id: string;
}

export interface Phone {
    cell: string;
    work: string;
    _id: string;
}

export interface Car {
    make: string;
    model: string;
    color: string;
    _id: string;
}

interface WorkAuth {
    workauth: string;
    title: string;
    startdate: string | null;
    enddate: string | null;
    _id: string;
}

interface License {
    haslicense: string | null;
    licensenumber: string;
    expdate: string | null;
    licensefile: File | null | string;
    _id: string;
}

export interface EmployeeInfo {
    employee_id: Employee;
    name: Name;
    picture: File | null | string;
    address: Address;
    phone: Phone;
    car: Car;
    ssn: string | null;
    dob: string | null;
    gender: string;
    citizenship: string | null;
    citizenshiptype: string;
    workauth: WorkAuth;
    license: License;
    references: Person[];
    contacts: Person[];
    status: string;
    feedback: string;
    __v: number;
}
