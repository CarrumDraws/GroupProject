export interface House{
    firstname: string;
    middlename: string | null;
    lastname: string;
    phone: string| null;
    email: string;
    buildaptnum: number;
    street: string;
    city: string;
    state: string;
    zip: string;
    beds: number | 0;
    mattresses: number| 0;
    tables: number | 0;
    chairs: number | 0;
}