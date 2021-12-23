const updateProfilePicture = (db) => (req, res) => {
  const { id, profilepic } = req.body;
  db.select("*")
    .from("users")
    .where("id", "=", id)
    .update({
      profilepic,
    })
    .then((data) => {
      if (data) {
        res.json("success");
      } else {
        res.status(400).json("couldn t update the profile picture");
      }
    })
    .catch((err) => {
      res.status(400).json("error");
    });
};
module.exports = {
  updateProfilePicture: updateProfilePicture,
};
