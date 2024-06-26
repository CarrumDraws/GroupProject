const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const refType = Schema.Types.ObjectId;

const CommentSchema = new Schema({
  report_id: {
    type: refType,
    ref: "Report",
    required: true,
  },
  employee_id: {
    type: refType,
    ref: "Employee",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

module.exports = Comment;
