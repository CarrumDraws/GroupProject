import { Comment } from "./comment";

export interface Report{
    _id: string;
    house_id: string;
    employee_id: {
        _id: string;
        email: string;
        password: string;
        isHR: false;
        __v: number;
    },
    title: string;
    description: string;
    timestamp: string;
    status: string;
    __v: number;
    picture: string;
    name: {
        firstname: string;
        middlename: string;
        lastname: string;
        preferredname: string;
        _id: string;
    }
    comments: Comment[];
}