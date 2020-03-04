import { tmpdir as getTempDir } from "os";

import multer from "fastify-multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, getTempDir());
  },
  filename: function(req, file, cb) {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const TWO_MB_IN_BYTES = 2097152;

export default multer({ storage, limits: { fileSize: TWO_MB_IN_BYTES } });
