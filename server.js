import postgres from "postgres";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

dotenv.config();
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIEWS_DIR = path.join(__dirname, "views");
const PARTIALS_DIR = path.join(VIEWS_DIR, "partials");
app.engine("html", engine({ extname: ".html", defaultLayout: false, partialsDir: PARTIALS_DIR }));
app.set("view engine", "html");
app.set("views", VIEWS_DIR);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

// ✅ Ensure the POIs table exists
// ✅ Ensure the Users & POIs Table Exist
async function setupDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;
        
        await sql`
            CREATE TABLE IF NOT EXISTS logbook (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                description TEXT
            )`;
        
        console.log("✅ Users & POIs tables ready");
    } catch (err) {
        console.error("❌ Database setup failed:", err);
    }
}
setupDB();

// HOME ROUTE
app.get("/", (req, res) => {
    res.render("index", { title: "PINGAS" });
});
app.get("/brainrotinvestements", (req, res) => {
    res.render("brainrotinvestements");
})
app.get("/nutshack", (req, res) => {
    res.render("nutshack");
    console.log("SOMEONE IS IN THE NUTSHACK");
});
app.get("/osaka", (req, res) => {
    console.log("SATA ANDAGIII");
    res.render("osaka");
});
app.get("/granddad", (req, res) => {
    res.render("granddad");
})
if (!process.env.VERCEL && !process.env.NOW_REGION) {
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT}`);
    });
}

// ✅ Export the Expres
// ✅ Export the app for Vercel
export default app;