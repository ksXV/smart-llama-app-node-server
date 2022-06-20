"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImage = exports.handleApiCall = exports.app = void 0;
const clarifai_1 = __importDefault(require("clarifai"));
exports.app = new clarifai_1.default.App({
    apiKey: "dbb0c8898bb742b28e95d774851aed63",
});
const handleApiCall = (req, res) => {
    exports.app.models
        .predict(clarifai_1.default.FACE_DETECT_MODEL, req.body.input)
        .then((data) => {
        res.json(data);
    })
        .catch((err) => res.status(400).json("unable to work with API"));
};
exports.handleApiCall = handleApiCall;
const handleImage = (req, res, db) => {
    const { id } = req.body;
    db("users")
        .where("id", "=", id)
        .increment("entries", 1)
        .returning("entries")
        .then((entries) => {
        res.json(entries[0]);
    })
        .catch((err) => res.status(400).json("unable to get entries"));
};
exports.handleImage = handleImage;
