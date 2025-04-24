import { genSalt } from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required!"],
  },

  firstName: {
    type: String,
    required: false,
  },

  lastName: {
    type: String,
    required: false,
  },

  image: {
    type: String,
    required: false,
  },

  color: {
    type: Number,
    required: false,
  },

  profileSetup: {
    type: Boolean,
    defaultL: false,
  },
});

/* 
# Middleware to hash the password before saving and
 ! use regular function and not arrow function
! because arrow function does not have access to this
 */
userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  // ! make sure the next method is called always after generating the hash
  next();
});

const User = mongoose.model("Users", userSchema);

export default User;
