const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./src/config/database');
const dataRoutes = require('./src/route/dataRoute');

app.use(cors({
    origin: ['http://localhost:5173','http://localhost:5174,https://side-project-frontend-five.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api', dataRoutes);

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});







