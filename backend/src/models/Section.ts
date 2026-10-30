import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ILesson {
  _id: Types.ObjectId;
  name: string;
  video: {
    url: string;
    duration: number;
  };
  topic: {
    data: string;
    readingTime: number;
  };
}

export interface ISectionMethods {
  addLesson(lessonData: Partial<ILesson>): Promise<ISection>;
  updateLesson(lessonId: string | Types.ObjectId, updatedLessonData: Partial<ILesson>): Promise<ISection>;
  deleteLesson(lessonId: string | Types.ObjectId): Promise<ISection>;
  getLesson(lessonId: string | Types.ObjectId): ILesson | undefined;
}

export interface ISection extends Document, ISectionMethods {
  name: string;
  lessons: Types.DocumentArray<ILesson & Document>;
  course: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type SectionModel = Model<ISection, {}, ISectionMethods>;

const LessonSchema = new Schema<ILesson>({
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

const SectionSchema = new Schema<ISection, SectionModel, ISectionMethods>(
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
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

SectionSchema.methods.addLesson = function (this: ISection, lessonData: any) {
  this.lessons.push(lessonData);
  return this.save();
};

SectionSchema.methods.updateLesson = function (this: ISection, lessonId: any, updatedLessonData: any) {
  const lessonToUpdate = this.lessons.find(
    (lesson: any) => lesson._id.toString() === lessonId.toString()
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

SectionSchema.methods.deleteLesson = function (this: ISection, lessonId: any) {
  this.lessons = this.lessons.filter(
    (lesson: any) => lesson._id.toString() !== lessonId.toString()
  ) as any;
  return this.save();
};

SectionSchema.methods.getLesson = function (this: ISection, lessonId: any) {
  return this.lessons.find(
    (lesson: any) => lesson._id.toString() === lessonId.toString()
  ) as any;
};

export default (mongoose.models.Section as SectionModel) ||
  mongoose.model<ISection, SectionModel>("Section", SectionSchema);
