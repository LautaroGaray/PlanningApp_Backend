import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import cors from 'cors'

//Routers
import TasksRouter from './Router/TasksRouter.js'


const app = express();
const port = process.env.PORT || 3000; 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve('./');

//app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//app.use(express.urlencoded());
app.use(cors());
app.use(TasksRouter);

app.listen(port, () => {
    console.log(`Servidor escuchando en puerto :${port}`);
   
});

app.get('/', (req,res)=>{
    res.send({IsSuccess:true})
})





