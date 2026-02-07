import express from "express";
import multer from "multer";
import { requireAuth } from "../middleware/authMiddleware.js";
import { 
    getAllProjects, 
    getProjectById, 
    createProject, 
    updateProject, 
    deleteProject,
    getPublicProjects
} from "../controllers/projectsController.js";

const router = express.Router();

// Multer Konfiguration
const upload = multer({ 
    dest: "uploads/",
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Nur Bilder sind erlaubt!'), false);
        }
    }
});

// Multer Error Handler
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                error: 'Datei zu groß',
                message: 'Die Datei darf maximal 5MB groß sein.' 
            });
        }
        return res.status(400).json({ 
            error: 'Upload Fehler',
            message: err.message 
        });
    } else if (err) {
        return res.status(400).json({ 
            error: 'Upload Fehler',
            message: err.message 
        });
    }
    next();
};

// ÖFFENTLICHE ROUTEN (OHNE AUTH)
router.get("/public", getPublicProjects);

// GESCHÜTZTE ROUTEN (MIT AUTH)
router.get("/", requireAuth, getAllProjects);
router.get("/:id", requireAuth, getProjectById);
router.post("/", requireAuth, upload.single("image"), handleMulterError, createProject);
router.put("/:id", requireAuth, upload.single("image"), handleMulterError, updateProject);
router.delete("/:id", requireAuth, deleteProject);

export default router;