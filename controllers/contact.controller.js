import Contact from "../model/contact.model.js";

// Submit a new contact message (Public)
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, serviceInterest, message, companyUrl } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "Please provide all required fields: name, email, subject, message.",
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone: phone || "",
      subject,
      serviceInterest: serviceInterest || "",
      message,
      companyUrl: companyUrl || "",
      status: "unread",
    });

    res.status(201).json({
      body: newContact,
      message: "Your message has been sent successfully! Our team will get back to you shortly.",
    });
  } catch (error) {
    console.error("Error submitting contact message:", error);
    res.status(500).json({
      message: error.message || "Failed to submit contact message",
    });
  }
};

// Get all contact messages with filtering (Admin only)
export const getContactMessages = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
        { serviceInterest: searchRegex },
      ];
    }

    const messages = await Contact.find(filter).sort({ createdAt: -1 });
    const total = await Contact.countDocuments(filter);

    res.status(200).json({
      body: messages,
      total,
      message: "Contact messages retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving contact messages:", error);
    res.status(500).json({
      message: error.message || "Failed to retrieve contact messages",
    });
  }
};

// Get single contact message by ID (Admin only)
export const getContactMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Contact.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    // Auto mark as read if it was unread
    if (message.status === "unread") {
      message.status = "read";
      await message.save();
    }

    res.status(200).json({
      body: message,
      message: "Contact message retrieved successfully",
    });
  } catch (error) {
    console.error("Error retrieving contact message:", error);
    res.status(500).json({
      message: error.message || "Failed to retrieve contact message",
    });
  }
};

// Update contact message status & admin notes (Admin only)
export const updateContactMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updated = await Contact.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json({
      body: updated,
      message: "Contact message updated successfully",
    });
  } catch (error) {
    console.error("Error updating contact message:", error);
    res.status(500).json({
      message: error.message || "Failed to update contact message",
    });
  }
};

// Delete contact message (Admin only)
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    res.status(200).json({
      body: deleted,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    res.status(500).json({
      message: error.message || "Failed to delete contact message",
    });
  }
};
