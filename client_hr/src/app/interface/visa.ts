export interface Visa {
    employee_id: {
      _id: string;
      email: string;
      password: string;
      isHR: boolean;
      __v: number;
    };
    name: {
      firstname: string;
      lastname: string;
      preferredname: string;
      _id: string;
    };
    picture: string;
    workauth: {
      workauth: string;
      title: string | null;
      startdate: string;
      enddate: string;
      dayRemains: number | null;
      _id: string;
    };
    opt: {

        _id: string;
        __v: number;
        employee_id: string;
        i20: string | null;
        i983: string[] | null;
        optead: null,
        optreciept: string | null;
        status: string;
    };
  }