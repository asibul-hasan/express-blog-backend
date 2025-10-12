import Blog from "./../model/blog.model.js";

export const createBlog = async (req, res) => {
  try {
    const createBlog = await Blog.create(req.body);
    res
      .status(201)
      .json({ body: createBlog, message: "Blog created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogList = async (req, res) => {
  try {
    const { category, tags, isPublished } = req.query; // parameters from URL

    // Build a dynamic query object
    const query = {};

    // Add category filter only if provided and not empty
    if (category) {
      query.category = category;
    }

    // Add tags filter if provided, splitting comma-separated values into array
    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    // Add isPublished filter only if explicitly provided
    if (typeof isPublished !== "undefined") {
      query.isPublished = isPublished === "true"; // convert string to boolean
    }

    const blogList = await Blog.find(query);

    res.status(201).json({
      body: blogList,
      message: "Blogs fetched successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching blogs", error: err.message });
  }
};
// export const getBlogList = async (req, res) => {
//   try {
//     const blogList = await Blog.find({});
//     res
//       .status(201)
//       .json({ body: blogList, message: "BlogS fetched successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let singleBlog;

    if (id) {
      singleBlog = await Blog.findOne({ slug: id });
    } else {
      singleBlog = await Blog.findById(id);
    }

    if (!singleBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res
      .status(201)
      .json({ body: [singleBlog], message: "Blog fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateBlog = await Blog.findByIdAndUpdate(id, req.body);

    if (!updateBlog) {
      return res.status(404).send({ message: "No blog found" });
    }

    const updatedBlog = await Blog.findById(id);
    res
      .status(201)
      .json({ body: updatedBlog, message: "Blog updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteBlog = await Blog.findByIdAndDelete(id);
    if (!deleteBlog) {
      return res.status(404).send({ message: "No blog found" });
    }
    res.status(201).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// module.exports = { createBlog, getBlogList, getBlog, updateBlog, deleteBlog };
