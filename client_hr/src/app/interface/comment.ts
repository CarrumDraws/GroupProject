export interface Comment{
    _id: string;
    report_id: string;
    employee_id: {
        _id: string;
        email: string;
        password: string;
        isHR: boolean
        __v: number;
    },
    description: string;
    timestamp: string;
    __v: number;
    picture: string;
    name: {
        firstname: string;
        middlename: string;
        lastname: string;
        preferredname: string;
        _id: string;
    }
}