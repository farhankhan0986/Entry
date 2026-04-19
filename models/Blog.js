import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Content cannot be empty'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      default: 'General',
    },
    // For Guests: They provide a name, but authorId remains null
    authorName: {
      type: String,
      default: 'Anonymous',
    },
    // For OAuth Users: This will link to the User collection later
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    bannerImage: {
      type: String, // URL of the image
      default: '',
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt'
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;
