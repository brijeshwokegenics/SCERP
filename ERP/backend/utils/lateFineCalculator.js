function calculateLateFine(dueDate, currentDate = new Date(), finePerDay = 10) {
    const due = new Date(dueDate);
    const current = new Date(currentDate);
  
    const diffTime = current - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    if (diffDays > 0) {
      return diffDays * finePerDay;
    } else {
      return 0;
    }
  }
  
  module.exports = { calculateLateFine };
  