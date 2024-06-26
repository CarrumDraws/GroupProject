export interface Person {
    firstname: string;
    middlename: string;
    lastname: string;
    phone: string;
    email: string;
    relationship: string;
};

export type PersonKeys = keyof Person;