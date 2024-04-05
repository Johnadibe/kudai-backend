import express, { Request, Response, Express, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import DbInitialize from './src/database/init';

//create an app
const app = express();


// cors implementation
app.use(
  cors({
    origin: '*',
  })
);

// Middleware
app.use(express.urlencoded({ extended: true })); // Pass form data that are submitted and pass it into the body 
app.use(express.json()); // To parse json


// Global error Handler
app.use((err: TypeError, req: Request, res: Response, next: NextFunction) => {
  try {
    if (err) {
      return res.status(500).json({ status: false, message: (err as TypeError).message });
    }
  } catch (e) {}
});



// Basic landing page route
app.get('/', (req : Request, res : Response) => {
  res.send(`Welcome to ${process.env.APPNAME}`);
});

const PORT = process.env.PORT || 5000;

const Boostrap = async function () {
  try {
    await DbInitialize();
    app.listen(PORT, () => {
      console.log('Connection has been established successfully.');
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

Boostrap();
