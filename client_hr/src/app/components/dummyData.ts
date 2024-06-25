export const onboardingDummyData = {
    id: 1,
    employee_id: 'employeeid1',
    name: {
      firstname: 'John',
      middlename: 'A',
      lastname: 'Doe',
      preferredname: 'Johnny'
    },
    email:"example123@gmail.com",
    picture: 'fileid1',
    address: {
      buildaptnum: 123,
      street: 'Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345'
    },
    phone: {
      cell: 1234567890,
      work: 9876543210
    },
    car: {
      make: 'Toyota',
      model: 'Corolla',
      color: 'Blue'
    },
    ssn: 123456789,
    dob: new Date('1990-01-01'),
    gender: 'Male',
    citizenship: true,
    citizenshiptype: 'Citizen',
    title: 'Software Engineer',
    workauth: {
      workauth: 'H1B',
      startdate: new Date('2022-01-01'),
      enddate: new Date('2024-01-01')
    },
    license: {
      haslicense: true,
      licensenumber: 'A1234567',
      expdate: new Date('2025-01-01'),
      licensefile: '61107ecc-12d8-4a86-bffb-e0d87e031c6c'
    },
    references: [
      {
        firstname: 'Jane',
        middlename: 'B',
        lastname: 'Smith',
        phone: 2345678901,
        email: 'jane.smith@example.com',
        relationship: 'Friend'
      },
      {
        firstname: 'Jack',
        middlename: 'A',
        lastname: 'Smith',
        phone: 2345678901,
        email: 'jack.smith@example.com',
        relationship: 'Friend'
      }
    ],
    contacts: [
      {
        firstname: 'Mary',
        middlename: 'C',
        lastname: 'Johnson',
        phone: 3456789012,
        email: 'mary.johnson@example.com',
        relationship: 'Emergency Contact'
      }
    ],
    status: 'Not Started',
    feedback: 'No feedback yet'
  };
  