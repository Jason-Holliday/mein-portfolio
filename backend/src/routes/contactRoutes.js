import { Router } from "express";
import { contactController } from "../controllers/contactController.js";

const router = Router();

router.post("/contact", contactController);  

router.get("/contact", (req, res) => {
  res.json({ message: "Contact route works! Use POST to send messages." });
});

export default router;
