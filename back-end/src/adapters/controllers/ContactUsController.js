// backend/src/controllers/contactController.js
const contactUseCases = require('../../Usecases/ContactUsUsecase');

const createContactController= async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    const newMessage = await contactUseCases.createContactUs({ firstName, lastName, email, subject, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
};

const getContactsController = async (req, res) => {
  try {

    const { page = 1, limit = 10, sortBy = 'createdAt', sortingOrder = 'desc' } = req.query;

    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.min(50, Math.max(1, parseInt(limit)));
    const validatedSortingOrder = sortingOrder === 'asc' ? 1 : -1; 

    const { contacts, totalPages, totalItems } = await contactUseCases.getContactsUseCase({
      page: validatedPage,
      limit: validatedLimit,
      sortBy,
      sortingOrder: validatedSortingOrder,
    });

    res.json({
      data: {contacts},
      pagination: {
        currentPage: validatedPage,
        totalPages,
        totalItems,
        limit: validatedLimit,
      },
    });
  } catch (error) {
    console.log(error)
  }
}

const deleteContactController = async (req, res) => {
  try {
    const { messageId } = req.params;
    const deletedMessage = await contactUseCases.deleteContactUsecase(messageId);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully', deletedMessage });

  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
};

module.exports = { createContactController, getContactsController, deleteContactController,}