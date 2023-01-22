const logout = (req, res) => {
  // res.removeHeader("authorization")
  res.clearCookie("accessToken");
  res.status(200).send("user logout successfully");
};

module.exports = logout;
