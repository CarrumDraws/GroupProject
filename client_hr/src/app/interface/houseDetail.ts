export interface HouseDetail{
        _id: string;
        address: {
            buildaptnum: number;
            street: string;
            city: string;
            state: string;
            zip: string;
            _i: string;
        },
        landlord: {
            firstname: string;
            middlename: string | "";
            lastname: string;
            phone: string;
            email: string;
            _id: string;
        },
        members: string[],
        beds: number;
        mattresses: number;
        tables: number;
        chairs: number;
        __v: number;
}
