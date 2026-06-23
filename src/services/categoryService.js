const categoryRepository = require("../repositories/categoryRepository");

const createCategory = async (name) => {
  return await categoryRepository.createCategory(name);
};

const getAllCategories = async () => {
  return await categoryRepository.getAllCategories();
};

const getCategoryById = async (id) => {
  return await categoryRepository.getCategoryById(id);
};

const updateCategory = async (id, name) => {
  return await categoryRepository.updateCategory(id, name);
};

const deleteCategory = async (id) => {
  return await categoryRepository.deleteCategory(id);
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
