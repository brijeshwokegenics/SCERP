async function sendEmail(toEmail, subject, message) {
    console.log(`Sending Email to ${toEmail}: ${subject} - ${message}`);
    // Later integrate real Email service like SendGrid, SMTP etc.
  }
  
  module.exports = { sendEmail };
  