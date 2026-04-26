const Project = require("../models/Project");

// Create project (admin)
exports.createProject = async (req, res) => {
  try {
    const imageUrls = req.files
      ? req.files.map((file) => file.path)
      : [];

    const project = await Project.create({
      ...req.body,
      images: imageUrls,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
};



// Get all projects (public)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};
