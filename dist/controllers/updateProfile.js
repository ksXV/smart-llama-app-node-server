"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleProfileUpdate = (req, res, db) => {
    const { id } = req.params;
    const { name, age, pet } = req.body.formInput;
    db("users")
        .where({ id })
        .update({ name: name })
        .then((resp) => {
        if (resp) {
            res.json("success");
        }
        else {
            res.status(400).json("Not found");
        }
    })
        .catch((_err) => res.status(400).json("error updating user"));
};
exports.default = handleProfileUpdate;
