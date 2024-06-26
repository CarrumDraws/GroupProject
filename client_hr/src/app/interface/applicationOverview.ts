export interface ApplicationOverview{
        employee_id: {
            _id: number;
            email: string;
        };
        name: {
            firstname: string;
            lastname: string;
            preferredname: string;
        };
        picture: string;
}