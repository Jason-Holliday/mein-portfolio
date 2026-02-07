import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  techStack: [{
    type: String,
    trim: true
  }],
  gitHubUrl: {
    type: String,
    trim: true
  },
  liveDemoUrl: {
    type: String,
    trim: true
  },
  imgUrl: {
    type: String,
    default: ""
  },
  imgPublicId: {
    type: String,
    default: ""
  },
  userId: {
    type: String, 
    required: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});

projectSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Project", projectSchema);