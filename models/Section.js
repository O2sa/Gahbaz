import mongoose from "mongoose";
import Subject from "./Subject.js";

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 4,
    maxlength: 50,
  },
  lessons: [
    {
      name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 4,
        maxlength: 50,
      },

      video: {
        url: {
          type: String,
          default: "",
        },
        duration: {
          type: Number,
          default: 0,
        },
      },
      topic: {
        data: {
          type: String,
          default: "",
        },
        readingTime: {
          type: Number,
          default: 0,
        },
      },
    },
  ],
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
});

SectionSchema.methods.addLesson = function (lessonData) {
  this.lessons.push(lessonData);
  return this.save();
};

SectionSchema.methods.updateLesson = function (lessonId, updatedLessonData) {
  const lessonToUpdate = this.lessons.find(
    (lesson) => lesson._id.toString() === lessonId.toString()
  );
  if (!lessonToUpdate) {
    throw new Error("Lesson not found");
  }

  // Update lesson properties
  lessonToUpdate.name = updatedLessonData.name || lessonToUpdate.name;
  lessonToUpdate.video = updatedLessonData.video || lessonToUpdate.video;
  lessonToUpdate.topic = updatedLessonData.topic || lessonToUpdate.topic;

  return this.save();
};

SectionSchema.methods.deleteLesson = function (lessonId) {
  this.lessons = this.lessons.filter(
    (lesson) => lesson._id.toString() !== lessonId.toString()
  );
  return this.save();
};

SectionSchema.methods.getLesson = function (lessonId) {
  const theLesson = this.lessons.find(
    (lesson) => lesson._id.toString() === lessonId.toString()
  );
  return theLesson;
};

export default mongoose.model("Section", SectionSchema);
