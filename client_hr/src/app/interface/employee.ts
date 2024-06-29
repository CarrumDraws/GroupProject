// Define the interface for Employee
export interface Employee {
    //ID
    employee_id: {
        _id: string;
        email: string;
        password: string;
        isHR: false,
        __v: 0
    },
    // Name
    name: {
      firstname: string;
      middlename: string;
      lastname: string;
      preferredname: string;
    };     
    // Contact Info
    phone: {
        cell: string;
        work: string;
    };

    picture: string;
  
    // Personal Info
    ssn: string;
  
    // Work Status
    workauth: {
      workauth: string;
      title: string;
      startdate: Date;
      enddate: Date;
    };

  }