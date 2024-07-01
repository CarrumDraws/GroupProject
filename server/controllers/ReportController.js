const processFile = require("../utils/processFile.js");
const idToFileLink = require("../utils/idToFileLink.js");

const Registration = require("../models/Registration.js");
const Employee = require("../models/Employee.js");
const Onboarding = require("../models/Onboarding.js");
const Report = require("../models/Report.js");
const Comment = require("../models/Comment.js");
const File = require("../models/File.js");
const Opt = require("../models/Opt.js");
const House = require("../models/House.js");

const { getFileUrl } = require("../config/s3.js");

// Gets YOUR reports
const getReports = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    let reports = await Report.find({
      employee_id: ID,
    })
      .populate("employee_id")
      .exec();
    if (!reports) res.status(200).json([]);

    let profile = await Onboarding.findOne(
      { employee_id: ID },
      "name picture"
    ).exec();

    if (!profile)
      return res.status(400).json({ message: "Unable to find User Data" });

    const updatedReports = await Promise.all(
      reports.map(async (report) => {
        const pictureUrl = await idToFileLink(profile.picture);
        const updatedReport = {
          ...report.toObject(),
          picture: pictureUrl,
          name: profile.name,
        };
        return updatedReport;
      })
    );

    res.status(200).json(updatedReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Gets a report and all comments under the report
const getReport = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const { reportid } = req.params;
    if (!reportid)
      return res.status(400).json({ message: "Missing reportid Param" });

    // Construct Report ---
    let report = await Report.findById(reportid).populate("employee_id").exec();
    if (!report) return res.status(400).json({ message: "Report Not Found" });

    let profile = await Onboarding.findOne(
      { employee_id: report.employee_id },
      "name picture"
    ).exec();
    if (!profile)
      return res.status(400).json({ message: "Onboarding Not Found" });

    const pictureUrl = await idToFileLink(profile.picture);
    report = {
      ...report.toObject(),
      picture: pictureUrl,
      name: profile.name,
    };

    // Construct Comments ---
    let comments = await Comment.find({ report_id: reportid })
      .populate("employee_id")
      .exec();

    // if no comments, return empty array (?)
    if (!comments) return res.status(200).json({ report, comments });

    const updatedComments = await Promise.all(
      comments.map(async (comment, index) => {
        let comEmployee = await Employee.findById(comment.employee_id._id);

        let updatedComment = {};

        // Note: You'll have to store the image on AWS3 and generate a link to it later!
        if (comEmployee.isHR) {
          const hrImg = await getFileUrl("HR_Profile.png");
          updatedComment = {
            ...comment.toObject(),
            picture: hrImg,
            name: {
              firstname: "HR",
              middlename: "",
              lastname: "Employee",
              preferredname: "",
              _id: null,
            },
          };
        } else {
          let commentProfile = await Onboarding.findOne(
            { employee_id: comment.employee_id._id },
            "name picture"
          ).exec();
          if (!commentProfile)
            return res
              .status(400)
              .json({ message: "Commenter Onboarding Profile Not Found" });

          const pictureUrl = await idToFileLink(commentProfile.picture);
          updatedComment = {
            ...comment.toObject(),
            picture: pictureUrl,
            name: commentProfile.name,
          };
        }
        return updatedComment;
      })
    );

    // Sort comments by time
    updatedComments.sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    return res.status(200).json({ report, comments: updatedComments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addReport = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    let { title, description } = req.body;

    if (!title || title.length == 0)
      return res.status(400).send("Missing Title");
    if (!description || description.length == 0)
      return res.status(400).send("Missing Description");

    const house = await House.findOne({ members: ID });
    if (!house) return res.status(400).send("House Not Found");

    const onboarding = await Onboarding.findOne({ employee_id: ID });
    if (!onboarding) return res.status(400).send("Onboarding Not Found");

    const report = new Report({
      house_id: house._id,
      employee_id: ID,
      title: title,
      description: description,
      status: "Open",
    });

    let returnData = {
      ...report.toObject(),
      name: onboarding.name,
    };

    await report.save();
    res.status(200).json(returnData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const { reportid } = req.params;
    if (!reportid)
      return res.status(400).json({ message: "Missing reportid Param" });

    let { description } = req.body;
    if (!description || description.length == 0)
      return res.status(400).send("Missing Description");

    // const house = await House.findOne({ members: ID });
    // if (!house) return res.status(400).send("House Not Found");

    const report = await Report.findById(reportid);
    if (!report) return res.status(400).send("Report Not Found");

    const employee = await Employee.findById(ID);
    if (!employee) return res.status(400).send("Employee Not Found");

    const onboarding = await Onboarding.findOne({ employee_id: ID });
    if (!onboarding) return res.status(400).send("Onboarding Not Found");

    if (report.status === "Closed")
      return res.status(400).send("Can't add Comment to Closed Report");

    const comment = new Comment({
      report_id: reportid,
      employee_id: ID,
      description: description,
    });

    const pictureUrl = await idToFileLink(onboarding.picture);
    let returnData = {
      ...comment.toObject(),
      name: onboarding.name,
      employee_id: employee,
      picture: pictureUrl,
    };

    await comment.save();
    res.status(200).json(returnData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const editComment = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const { commentid } = req.params;
    if (!commentid)
      return res.status(400).json({ message: "Missing commentid Param" });

    let { description } = req.body;
    if (!description || description.length == 0)
      return res.status(400).send("Missing Description");

    let comment = await Comment.findById(commentid);
    if (!comment) return res.status(400).send("Comment Not Found");
    if (comment.employee_id != ID)
      return res
        .status(400)
        .send("You don't have permission to edit this comment");

    const report = await Report.findById(comment.report_id);
    if (!report) return res.status(400).send("Comment's Report Not Found");

    if (report.status === "Closed")
      return res.status(400).send("Can't Edit Comment of Closed Report");

    const updatedComment = await Comment.findByIdAndUpdate(
      commentid,
      {
        description,
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHouseReports = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const { houseid } = req.params;
    if (!houseid)
      return res.status(400).json({ message: "Missing houseid Param" });

    let house = await House.findById(houseid);
    if (!house)
      return res.status(400).json({ message: "Unable to find House" });

    let reports = await Report.find({
      house_id: houseid,
    })
      .populate("employee_id")
      .exec();
    if (!reports) res.status(200).json([]);

    const updatedReports = await Promise.all(
      reports.map(async (report) => {
        let profile = await Onboarding.findOne(
          { employee_id: report.employee_id },
          "name picture"
        ).exec();

        if (!profile)
          return res.status(400).json({ message: "Unable to find User Data" });

        const pictureUrl = await idToFileLink(profile.picture);
        const updatedReport = {
          ...report.toObject(),
          picture: pictureUrl,
          name: profile.name,
        };
        return updatedReport;
      })
    );

    res.status(200).json(updatedReports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleReport = async (req, res) => {
  try {
    const { ID, EMAIL, ISHR } = req.body;
    const { reportid } = req.params;
    if (!reportid)
      return res.status(400).json({ message: "Missing reportid Param" });

    let report = await Report.findById(reportid);
    if (!report) return res.status(404).json({ message: "No Report Found" });

    const updatedReport = await Report.findByIdAndUpdate(
      reportid,
      {
        status: report.status === "Open" ? "Closed" : "Open",
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getReports,
  getReport,
  addReport,
  addComment,
  editComment,
  getHouseReports,
  toggleReport,
};
