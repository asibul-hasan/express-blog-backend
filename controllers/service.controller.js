import Service from "../model/service.model.js";

export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res
      .status(201)
      .json({ body: service, message: "Service created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceList = async (req, res) => {
  try {
    const serviceList = await Service.find({});
    res
      .status(201)
      .json({ body: serviceList, message: "Services fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const singleService = await Service.findById(id);

    if (!singleService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res
      .status(201)
      .json({ body: singleService, message: "Service fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedService = await Service.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(201).json({
      body: updatedService,
      message: "Service updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(201).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
