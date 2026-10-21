import mongoose from "mongoose";
import validator from "validator";

const UserSchema = new mongoose.Schema(
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
        validator: validator.isEmail,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      index: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
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

// Virtual getters and setters for backwards compatibility
UserSchema.virtual("firstName")
  .get(function () {
    return this.name ? this.name.split(/\s+/)[0] : "";
  })
  .set(function (val) {
    const lastName = this.name ? this.name.split(/\s+/).slice(1).join(" ") : "";
    this.name = `${val || ""} ${lastName}`.trim();
  });

UserSchema.virtual("lastName")
  .get(function () {
    return this.name ? this.name.split(/\s+/).slice(1).join(" ") : "";
  })
  .set(function (val) {
    const firstName = this.name ? this.name.split(/\s+/)[0] : "";
    this.name = `${firstName} ${val || ""}`.trim();
  });

// Pre-validate hook to synthesize name if legacy firstName/lastName were provided
UserSchema.pre("validate", function (next) {
  if (!this.name && (this.get("firstName") || this.get("lastName"))) {
    this.name = `${this.get("firstName") || ""} ${this.get("lastName") || ""}`.trim();
  }
  next();
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
