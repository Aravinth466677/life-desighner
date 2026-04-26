import multer from "multer";
import { initCloudinary } from "../config/cloudinary.js";

const cloudinary = initCloudinary();

const storage = {
  _handleFile(_req, file, cb) {
    const isImage = file.mimetype?.startsWith("image/");
    if (!isImage) {
      const err = new Error("Only image uploads are allowed");
      err.statusCode = 400;
      cb(err);
      return;
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "interior_website/projects",
        resource_type: "image",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      },
      (err, result) => {
        if (err) return cb(err);
        cb(null, {
          path: result?.secure_url ?? result?.url,
          filename: result?.public_id,
          bytes: result?.bytes,
        });
      }
    );

    file.stream.pipe(stream);
  },

  async _removeFile(_req, file, cb) {
    try {
      const publicId = file?.filename || file?.public_id;
      if (publicId) {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
          invalidate: true,
        });
      }
      cb(null);
    } catch (err) {
      cb(err);
    }
  },
};

export const uploadProjectImages = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});
