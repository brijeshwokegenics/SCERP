const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middlewares/auth'); // Auth middleware to protect routes
const { isSchoolAdmin } = require('../middlewares/roles');


router.post('/', auth, isSchoolAdmin,  expenseController.createExpense);
router.get('/', auth, isSchoolAdmin,  expenseController.getAllExpenses);
router.get('/:id', auth, isSchoolAdmin,  expenseController.getExpenseById);
router.put('/:id', auth, isSchoolAdmin,  expenseController.updateExpense);
router.delete('/:id', auth, isSchoolAdmin,  expenseController.deleteExpense);

module.exports = router;
