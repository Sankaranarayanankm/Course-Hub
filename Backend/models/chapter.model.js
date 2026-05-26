  import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },    
    description: {
      type: String,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    video: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
