import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng cung cấp tên'],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Vui lòng cung cấp email'],
    validate: {
      validator: validator.isEmail,
      message: 'Vui lòng cung cấp một email hợp lệ',
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Vui lòng cung cấp mật khẩu'],
    minlength: 6,
    select: false,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'YourName',
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: 'MyCity',
  },
})

UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export default mongoose.model('User', UserSchema)
