import Category from "../model/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res
      .status(201)
      .json({ body: category, message: "Category created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryList = async (req, res) => {
  try {
    const categoryList = await Category.find({});
    res
      .status(200)
      .json({ body: categoryList, message: "Categories fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const singleCategory = await Category.findById(id);

    if (!singleCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res
      .status(200)
      .json({ body: singleCategory, message: "Category fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      body: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
