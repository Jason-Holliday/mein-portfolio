import Project from "../models/Project.js";
import cloudinary from "../services/cloudinary.js";
import fs from "fs";

// === Projekte abrufen (nur vom eingeloggten User) ===
export const getAllProjects = async (req, res) => {
  try {
    // Nur Projekte des eingeloggten Users abrufen
    const projects = await Project.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getAllProjects controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// === Einzelnes Projekt abrufen ===
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id // Nur eigene Projekte
    });

    if (!project) {
      return res.status(404).json({ message: "Projekt nicht gefunden" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error in getProjectById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// === Projekt erstellen ===
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, gitHubUrl, liveDemoUrl } = req.body;

    let imgUrl = "";
    let imgPublicId = "";

    if (req.file) {
      // Signed Upload mit vollständigen Parametern
      const timestamp = Math.round(Date.now() / 1000);
      const folder = "Projects";

      const uploadParams = {
        folder,
        timestamp,
        use_filename: true,
        unique_filename: false,
      };

      const signature = cloudinary.v2.utils.api_sign_request(
        uploadParams,
        process.env.CLOUDINARY_API_SECRET
      );

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        ...uploadParams,
        signature,
        api_key: process.env.CLOUDINARY_API_KEY,
        resource_type: "image",
      });

      imgUrl = result.secure_url;
      imgPublicId = result.public_id;

      // Temp-Datei löschen
      fs.unlinkSync(req.file.path);
    }

    const parsedTechStack = Array.isArray(techStack)
      ? techStack
      : [techStack];

    const project = new Project({
      title,
      description,
      techStack: parsedTechStack,
      gitHubUrl,
      liveDemoUrl,
      imgUrl,
      imgPublicId,
      userId: req.user.id, // ✅ User ID aus Better Auth
      userEmail: req.user.email, // ✅ Optional: Email speichern
      userName: req.user.name, // ✅ Optional: Name speichern
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Fehler in createProject:", error);
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// === Projekt aktualisieren ===
export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, gitHubUrl, liveDemoUrl } = req.body;
    
    // Prüfen ob Projekt existiert UND dem User gehört
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({ 
        message: "Projekt nicht gefunden oder keine Berechtigung" 
      });
    }

    let imgUrl = project.imgUrl;
    let imgPublicId = project.imgPublicId;

    // Neues Bild hochladen, wenn vorhanden
    if (req.file) {
      // Altes Bild in Cloudinary löschen
      if (project.imgPublicId) {
        try {
          await cloudinary.v2.uploader.destroy(project.imgPublicId, {
            resource_type: "image"
          });
        } catch (err) {
          console.warn("Altes Cloudinary-Bild konnte nicht gelöscht werden:", err);
        }
      }

      // Signed Upload - Signatur generieren
      const timestamp = Math.round(Date.now() / 1000);
      const folder = "Projects";

      const uploadParams = {
        folder: folder,
        timestamp: timestamp,
        use_filename: true
      };

      const signature = cloudinary.v2.utils.api_sign_request(
        uploadParams,
        process.env.CLOUDINARY_API_SECRET
      );

      // Neues Bild hochladen
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        ...uploadParams,
        signature: signature,
        api_key: process.env.CLOUDINARY_API_KEY,
      });

      imgUrl = result.secure_url;
      imgPublicId = result.public_id;

      // Temp-Datei löschen
      fs.unlinkSync(req.file.path);
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        techStack,
        gitHubUrl,
        liveDemoUrl,
        imgUrl,
        imgPublicId,
        updatedAt: new Date() 
      },
      { new: true }
    );

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error in updateProject controller", error);

    // Temp-Datei auch im Fehlerfall löschen
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Internal server error" });
  }
};

// === Projekt löschen ===
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prüfen ob Projekt existiert UND dem User gehört
    const project = await Project.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!project) {
      return res.status(404).json({ 
        message: "Projekt nicht gefunden oder keine Berechtigung" 
      });
    }

    // Cloudinary-Bild löschen, falls vorhanden
    if (project.imgPublicId) {
      try {
        await cloudinary.v2.uploader.destroy(project.imgPublicId, {
          resource_type: "image",
        });
      } catch (err) {
        console.warn("Cloudinary-Bild konnte nicht gelöscht werden:", err);
      }
    }

    await Project.findByIdAndDelete(id);
    res.status(200).json({ 
      message: "Projekt + Cloudinary-Bild erfolgreich gelöscht",
      projectId: id
    });
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    res.status(500).json({ message: "Serverfehler beim Löschen" });
  }
};

// Öffentliche Projekte abrufen (für Portfolio-Ansicht) ===
export const getPublicProjects = async (req, res) => {
  try {
    // Alle Projekte abrufen (ohne User-Filter)
    // Nur verwenden wenn du eine öffentliche Portfolio-Seite hast
    const projects = await Project.find()
      .select('-userId') // User ID nicht zurückgeben
      .sort({ createdAt: -1 });
    
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error in getPublicProjects controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};