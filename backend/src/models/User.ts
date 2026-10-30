import mongoose, { Document, Model, Schema, Types } from "mongoose";
import validator from "validator";

export type UserRole = "student" | "teacher" | "admin" | "super-admin" | "user";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  university?: Types.ObjectId;
  lastActivity: Date;
  kind?: string;
  isAdmin: boolean;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 3,
      maxlength: 70,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin", "super-admin", "user"],
      default: "student",
    },
    university: {
      type: Schema.Types.ObjectId,
      ref: "University",
      index: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "kind",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual getter for backwards compatibility with legacy isAdmin checks
UserSchema.virtual("isAdmin").get(function (this: IUser) {
  return this.role === "admin" || this.role === "super-admin";
});

// Virtual getters and setters for backwards compatibility
UserSchema.virtual("firstName")
  .get(function (this: IUser) {
    return this.name ? this.name.split(/\s+/)[0] : "";
  })
  .set(function (this: IUser, val: string) {
    const lastName = this.name ? this.name.split(/\s+/).slice(1).join(" ") : "";
    this.name = `${val || ""} ${lastName}`.trim();
  });

UserSchema.virtual("lastName")
  .get(function (this: IUser) {
    return this.name ? this.name.split(/\s+/).slice(1).join(" ") : "";
  })
  .set(function (this: IUser, val: string) {
    const firstName = this.name ? this.name.split(/\s+/)[0] : "";
    this.name = `${firstName} ${val || ""}`.trim();
  });

// Pre-validate hook to synthesize name if legacy firstName/lastName were provided
UserSchema.pre("validate", function (this: any, next) {
  if (!this.name && (this.get("firstName") || this.get("lastName"))) {
    this.name = `${this.get("firstName") || ""} ${this.get("lastName") || ""}`.trim();
  }
  next();
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
