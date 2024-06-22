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

    let password = "Abc1@2";
    password = await bcrypt.hash(password, Number(process.env.SALT));

    const user = new Employee({
      email: "HREmployee@gmail.com",
      password: password,
      isHR: true,
    });
    await user.save();

    console.log("DB initialized");
  } catch (error) {
    console.error(error);
  } finally {
    await db.close();
  }
})();
