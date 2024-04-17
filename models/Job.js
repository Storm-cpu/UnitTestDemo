import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Vui lòng cung cấp cho công ty'],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, 'Vui lòng cung cấp vị trí làm việc'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['interview', 'declined', 'pending'],
      default: 'pending',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship'],
      default: 'full-time',
    },
    jobLocation: {
      type: String,
      default: 'Thanh pho',
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vui lòng cung cấp thông tin người dùng'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Job', JobSchema)
