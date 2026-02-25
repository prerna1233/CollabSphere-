require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.get('/test', (req, res) => res.send('Test route working'));
app.get('/test', (req, res) => res.send('Test route working'));
const authroute = require('./routes/routes');
const geminiRoute = require('./routes/gemini');
const geminiListModelsRoute = require('./routes/gemini-listmodels');
const projectRoute = require('./routes/projects');
const notesRoute = require('./routes/notes');
const filesRoute = require('./routes/files');
const cors = require('cors');
app.use(cors());

app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
})

app.use('/api/auth',authroute)
app.use('/api/gemini', geminiRoute)
app.use('/api/gemini-listmodels', geminiListModelsRoute);
app.use('/api/projects', projectRoute);
app.use('/api/notes', notesRoute);
app.use('/api/files', filesRoute);

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})

