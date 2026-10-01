const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['Creator', 'Member'],
      default: 'Member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const studyGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      minlength: [3, 'Group name must be at least 3 characters long'],
      maxlength: [100, 'Group name cannot exceed 100 characters']
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [80, 'Subject cannot exceed 80 characters']
    },
    description: {
      type: String,
      required: [true, 'Description/Topic is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters long'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    meetingInfo: {
      type: String,
      required: [true, 'Meeting time / schedule or link is required'],
      trim: true,
      maxlength: [200, 'Meeting info cannot exceed 200 characters']
    },
    maxMembers: {
      type: Number,
      required: [true, 'Maximum members limit is required'],
      min: [2, 'Maximum members capacity must be at least 2'],
      max: [100, 'Maximum members capacity cannot exceed 100']
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [memberSchema],
    sharedNotes: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Open', 'Full'],
      default: 'Open'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property for remainingSlots
studyGroupSchema.virtual('remainingSlots').get(function () {
  const currentCount = this.members ? this.members.length : 0;
  return Math.max(0, this.maxMembers - currentCount);
});

// Update status automatically before save
studyGroupSchema.pre('save', function (next) {
  const memberCount = this.members ? this.members.length : 0;
  this.status = memberCount >= this.maxMembers ? 'Full' : 'Open';
  next();
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

module.exports = StudyGroup;
