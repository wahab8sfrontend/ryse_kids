export function requireRole(role) {
  return function (req, res, next) {
    if (req.user.role === role) {
      next();
    } else {
      return res
        .status(403)
        .json({ error: `${req.user.role} cannot access this route` });
    }
  };
}
