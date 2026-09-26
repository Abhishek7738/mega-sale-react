const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const port = 5000;

app.get("/api/health", (req, res) => {
    res.json({
        message: "Backend is running successfully"
    });
});

app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);
});