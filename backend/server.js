const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path"); // ✅ Add this line

require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" })); // Or use your frontend URL instead of "*"
app.use(express.json());

// Serve React frontend
app.use(express.static(path.join(__dirname, "..", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});


// 🔹 Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL Connected!");
});

// 🔹 Multer (Temporary Storage)
const upload = multer({ dest: "uploads/" });

// 🔹 API to Upload Image & Store in MySQL
app.post("/upload", upload.array("images", 6), async (req, res) => {
  try {
    const { user_name, age, gender, habits } = req.body;

    // Insert user details first (Using Promise)
    const insertUserQuery =
      "INSERT INTO users (user_name, age, gender, habits) VALUES (?, ?, ?, ?)";

    db.query(insertUserQuery, [user_name, age, gender, habits], async (err, result) => {
      if (err) {
        console.error("User insert error:", err);
        return res.status(500).json({ error: "Database error while inserting user" });
      }

      const userId = result.insertId;

      try {
        // Upload images to Cloudinary and store URLs in MySQL
        const imageUploadPromises = req.files.map(async (file) => {
          const cloudinaryResult = await cloudinary.uploader.upload(file.path);

          // Store image URL in the database
          return new Promise((resolve, reject) => {
            db.query("INSERT INTO images (user_id, image_url) VALUES (?, ?)",
              [userId, cloudinaryResult.secure_url],
              (err) => {
                if (err) reject(err);
                resolve(cloudinaryResult.secure_url);
              });
          });
        });

        // Wait for all images to be uploaded
        const uploadedImages = await Promise.all(imageUploadPromises);

        // Delete local temp files
        req.files.forEach((file) => {
            try {
              fs.unlinkSync(file.path);
            } catch (err) {
              console.error("File delete error:", err);
            }
          });


        res.json({ message: "Images uploaded!", user_id: userId, images: uploadedImages });
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        res.status(500).json({ error: "Error uploading images" });
      }
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// 🔹 API to Fetch All Uploaded Images with User Info
app.get("/images", (req, res) => {
  const fetchImagesQuery = `
    SELECT images.id, images.image_url, images.uploaded_at, users.user_name, users.age, users.gender, users.habits
    FROM images
    JOIN users ON images.user_id = users.id
    ORDER BY images.uploaded_at DESC;
  `;

  db.query(fetchImagesQuery, (err, results) => {
    if (err) {
      console.error("Fetch images error:", err);
      return res.status(500).json({ error: "Error fetching images" });
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
