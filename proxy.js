const express = require("express");
const app = express();
const PORT = 3000;

(async () => {
    const fetch = (await import("node-fetch")).default;

    app.use((req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        next();
    });

    app.get("/getpasses", async (req, res) => {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        try {
            // Correct RoProxy endpoint for gamepasses
            const response = await fetch(`https://inventory.roproxy.com/v1/users/${userId}/inventory/34`);
            if (!response.ok) {
                return res.status(response.status).json({ error: "Failed to fetch gamepasses" });
            }
            const data = await response.json();
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    app.listen(PORT, () => {
        console.log(`Proxy running at http://localhost:${PORT}`);
    });
})();
