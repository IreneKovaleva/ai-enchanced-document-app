import { Router, Request, Response } from "express";
import { getAnswer } from "../controllers/answer.controller";
import { fileUploader } from "../controllers/file.upload.controller";
import fileUpload from "express-fileupload";

const router = Router();

router.use(fileUpload({}));

router.post("/answer", async (req, res) => {
    await getAnswer(req, res);
});

router.post("/upload", async (req: Request, res: Response): Promise<void> => {
    await fileUploader(req, res)
})


export default router;