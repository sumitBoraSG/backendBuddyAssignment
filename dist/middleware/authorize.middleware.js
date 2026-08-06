export const authorize = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
        console.log(req.user.role);
        return res.status(403).json({
            message: "Forbidden",
        });
    }
    next();
};
//# sourceMappingURL=authorize.middleware.js.map