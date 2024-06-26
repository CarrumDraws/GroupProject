export interface Profile {
    profile: {
      employee_id: {
        _id: number;
        email: string;
      };
      __v: number;
      address: {
        buildaptnum: number;
        street: string;
        city: string;
        state: string;
        zip: string;
        _id: number;
      };
      car: {
        make: string;
        model: string;
        color: string;
        _id: number;
      };
      citizenship: boolean;
      citizenshiptype: string | "";
      contacts: {
        firstname: string;
        middlename: string;
        lastname: string;
        phone: number;
        email: string;
        relationship: string;
        _id: number;
      }[];
      dob: string; // Assuming this is a date string
      feedback: string | "";
      gender: string;
      license: {
        haslicense: boolean;
        licensenumber: string | "";
        expdate: string | ""; // Assuming this is a date string
        licensefile: string | "";
        _id: number;
      };
      name: {
        firstname: string;
        lastname: string;
        preferredname: string;
        _id: number;
      };
      phone: {
        cell: number;
        work: number;
        _id: number;
      };
      picture: string;
      references: {
        firstname: string;
        middlename: string;
        lastname: string;
        phone: number;
        email: string;
        relationship: string;
        _id: number;
      }[];
      ssn: number;
      status: string;
      workauth: {
        workauth: string;
        title: string;
        startdate: string; // Assuming this is a date string
        enddate: string; // Assuming this is a date string
        _id: number;
      };
    };
    opt: null;
  }