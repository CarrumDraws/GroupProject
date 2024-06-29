const db = require("./connection.js");
const bcrypt = require("bcryptjs");
const Comment = require("../models/Comment.js");
const Employee = require("../models/Employee.js");
const File = require("../models/File.js");
const House = require("../models/House.js");
const Onboarding = require("../models/Onboarding.js");
const Opt = require("../models/Opt.js");
const Registration = require("../models/Registration.js");
const Report = require("../models/Report.js");

const employeesData = require("./seeddata/employees.json");
const housesData = require("./seeddata/houses.json");
const registrationData = require("./seeddata/registration.json");
const onboardingData = require("./seeddata/onboarding.json");
const optData = require("./seeddata/opt.json");

const pictureData = require("./seeddata/pictures.json");
const licenseData = require("./seeddata/licenses.json");
const optreceiptData = require("./seeddata/optreceipt.json");
const opteadData = require("./seeddata/optead.json");
const i983AData = require("./seeddata/i983A.json");
const i983BData = require("./seeddata/i983B.json");
const i20Data = require("./seeddata/i20.json");

(async () => {
  try {
    await Promise.all([
      Comment.deleteMany(),
      Employee.deleteMany(),
      File.deleteMany(),
      House.deleteMany(),
      Onboarding.deleteMany(),
      Opt.deleteMany(),
      Registration.deleteMany(),
      Report.deleteMany(),
    ]);

    let HRPass = "Abc123!";
    HRPass = await bcrypt.hash(HRPass, Number(process.env.SALT));
    const HRPerson = new Employee({
      email: "HREmployee@gmail.com",
      password: HRPass,
      isHR: true,
    });
    await HRPerson.save();

    // Hash all Employee Passwords
    for (const employee of employeesData) {
      try {
        employee.password = await bcrypt.hash(
          employee.password,
          Number(process.env.SALT)
        );
      } catch (error) {
        console.error(
          `Error hashing password for employee ${employee.id}:`,
          error
        );
      }
    }

    let employees = await Employee.insertMany(employeesData);
    let registrations = await Registration.insertMany(registrationData);

    // First Pass: Add everything that JUST needs employees._id
    // Houses, All Files (Pictures, Licenses, etc)
    employees.forEach((employee, index) => {
      housesData[index % 3].members.push(employee._id); // Fill Houses w/id's

      // Attach id to Files
      if (pictureData[index]) pictureData[index].employee_id = employee._id;
      if (licenseData[index]) licenseData[index].employee_id = employee._id;
      if (optreceiptData[index])
        optreceiptData[index].employee_id = employee._id;
      if (opteadData[index]) opteadData[index].employee_id = employee._id;
      if (i983AData[index]) i983AData[index].employee_id = employee._id;
      if (i983BData[index]) i983BData[index].employee_id = employee._id;
      if (i20Data[index]) i20Data[index].employee_id = employee._id;
    });

    let houses = await House.insertMany(housesData);

    let pictures = await File.insertMany(pictureData);
    let licenses = await File.insertMany(licenseData);
    let optreceipts = await File.insertMany(optreceiptData);
    let opteads = await File.insertMany(opteadData);
    let i983As = await File.insertMany(i983AData);
    let i983Bs = await File.insertMany(i983BData);
    let i20s = await File.insertMany(i20Data);

    // Second Pass: Add everything that relies on a fileid
    // Onboarding, OPT
    employees.forEach((employee, index) => {
      if (onboardingData[index]) {
        onboardingData[index].employee_id = employee._id; // Attach id
        // Attach picture
        if (pictures[index])
          onboardingData[index].picture = pictures[index]._id;
        // Attach license
        if (licenses[index])
          onboardingData[index].license.licensefile = licenses[index]._id;
      }
      if (optData[index]) {
        optData[index].employee_id = employee._id; // Attach id
        // Attach Files
        if (optreceipts[index])
          optData[index].optreciept = optreceipts[index]._id;
        if (opteads[index]) optData[index].optead = opteads[index]._id;
        if (i983As[index] && i983Bs[index])
          optData[index].i983 = [i983As[index]._id, i983Bs[index]._id];
        if (i20s[index]) optData[index].i20 = i20s[index]._id;
      }
    });

    let onboarding = await Onboarding.insertMany(onboardingData);
    let opt = await Opt.insertMany(optData);
    console.log("DB initialized");
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
  }
})();
