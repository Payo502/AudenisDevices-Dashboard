import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { spawn } from 'child_process';
import { getSensorData } from './data/getDataup.cjs';



/* Configuration */
dotenv.config();
const app = express();

/* Middlewares */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* Routes */

app.get('/sensordata/:sensorType', getSensorData);

/* Express Server Setup */
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
    
    const child = spawn('node', ['../server/data/getDataup.cjs'])
    child.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    child.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    child.on('close', (code) => {
        if (code !== 0) {
            console.log(`ps process exited with code ${code}`);
        }
    });
});


 