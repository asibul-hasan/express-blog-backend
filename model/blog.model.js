import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    meta_title: {
      type: String,
      required: true,
    },
    meta_description: {
      type: String,
      required: true,
    },
    blog_title: {
      type: String,
      required: true,
    },
    blog_content: {
      type: String,
      required: true,
    },
    blog_slug: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    tags: {
      type: [String],
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
