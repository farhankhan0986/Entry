import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blogId: {
      type: String,
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      default: "Anonymous",
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Comment cannot be empty"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
