// backend/middlewares/roles.js

module.exports = {
    isSuperAdmin: (req, res, next) => {
      if (req.user.role === 'SUPER_ADMIN') {
        return next();
      }
      return res.status(403).json({ message: 'Requires SUPER_ADMIN role' });
    },
  
    isSchoolAdmin: (req, res, next) => {
      if (req.user.role === 'SCHOOL_ADMIN') {
        return next();
      }
      return res.status(403).json({ message: 'Requires SCHOOL_ADMIN role' });
    },
  };
  