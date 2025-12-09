import multer from "multer";

const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");
export const multipleUpload = multer({ storage }).array("images", 10); // Max 10 images
