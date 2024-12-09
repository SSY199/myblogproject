// import Post from "../models/post.modal.js";
// export const create = async (req, res, next) => {
//   if(!req.body.isAdmin) {
//     return next(errorHandler(403, "Only admins can create users"));
//   }
//   if(!req.body.title || !req.body.content) {
//     return next(errorHandler(400, "Title and content are required"));
//   }
//   const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]+/g, '-');
//   const newPost = new Post ({
//     ...req.body, slug, userId: req.body.id
//   });
//   try {
//     const savedPost = await newPost.save();
//     res.status(201).json(savedPost);
//   } catch (error) {
//     next(error);
//   }
// };
import Post from "../models/post.modal.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return next(errorHandler(403, "Only admins can create posts"));
    }

    const { title, content, image, category } = req.body;
    if (!title || !content) {
      return next(errorHandler(400, "Title and content are required"));
    }
    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s-]+/g, "")
      .replace(/\s+/g, "-");
 
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return next(errorHandler(409, "A post with this title already exists. Please use a different title."));
    }
 
    const newPost = new Post({
      title,
      content,
      image: image || "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
      category: category || "uncategorized",
      slug,
      userId: req.user.id,  
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);  
  }
};

