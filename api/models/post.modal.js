import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to User collection
      required: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 10, // Example minimum length
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Refers to User collection
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likes: {
      type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
      ref: "User",
      default: [],
    },
  },
  { timestamps: true } // Automatically manage `createdAt` and `updatedAt`
);

const Post = mongoose.model("Post", postSchema);

export default Post;
