import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lesson name is required"],
    minlength: 2,
    maxlength: 100,
    trim: true,
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
});

const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Section name is required"],
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    lessons: {
      type: [LessonSchema],
      default: [],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

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

  lessonToUpdate.name = updatedLessonData.name || lessonToUpdate.name;
  if (updatedLessonData.video) {
    lessonToUpdate.video = { ...lessonToUpdate.video, ...updatedLessonData.video };
  }
  if (updatedLessonData.topic) {
    lessonToUpdate.topic = { ...lessonToUpdate.topic, ...updatedLessonData.topic };
  }

  return this.save();
};

SectionSchema.methods.deleteLesson = function (lessonId) {
  this.lessons = this.lessons.filter(
    (lesson) => lesson._id.toString() !== lessonId.toString()
  );
  return this.save();
};

SectionSchema.methods.getLesson = function (lessonId) {
  return this.lessons.find(
    (lesson) => lesson._id.toString() === lessonId.toString()
  );
};

export default mongoose.models.Section || mongoose.model("Section", SectionSchema);
