import passport from "passport";

const tokenVerity = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user, response) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      if (response && response.message === "No auth token") {
        return res.status(401).json({ message: "No access token" });
      }

      if (response && response.message === "jwt expired") {
        return res.status(401).json({ message: "Access token expired" });
      }
    }

    req.user = user;

    next();
  })(req, res, next);
};

export default tokenVerity;
