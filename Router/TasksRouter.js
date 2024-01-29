import {Router} from 'express';
import config from '../config.js';

//Domain Layer
import TaskDomain from '../Domain/Logic/TaskDomain.js';
import TasksData from '../Domain/Entities/TasksData.js'
import IdDomain from '../Domain/Logic/IdDomain.js';
import IdData from '../Domain/Entities/IdData.js';
 //Helpers
 import DateTimeNow from '../Domain/Helpers/DateHelper.js'
 import CreateEntity from '../Domain/Helpers/TaskEntityHelper.js'


//Adapter Layer
import MongoDBAdapter from '../Adapters/MongoDBAdapter.js';



const TasksRouter = Router();
//**  GET  **/
//Get All Data
TasksRouter.get(config.baseUrl+'Task/GetAll',  async (req, res) => {
    try{
        let mongoAdapter = new MongoDBAdapter(config);
        let taskDomain = new TaskDomain(mongoAdapter);        
        let result =  await taskDomain.Select(null, TasksData.collection);   
        let status = result.IsSuccess?200:400       
        res.status(status).send(result)
    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Tasks ->'+err, Data: null}));
    }       
});
//**  POST  **/
//Create Task
TasksRouter.post(config.baseUrl+'Task/CreateTask', async(req,res)=>{
    try{
        let mongoAdapter = new MongoDBAdapter(config);       
        let task = CreateEntity(req.body);       

        //Validations
        if((task.name.trim() === '') || task.description.trim() === '' || task.agent.trim() ===''){
            res.status(400).send({IsSuccess:false, Message:'Name and Desciprion is required'});
            return;
        }
       
        //Check if exists
        let taskDomain = new TaskDomain(mongoAdapter);
        let selectResult = await taskDomain.SelectOne({name:task.name, description:task.description}, TasksData.collection);
        if(selectResult.IsSuccess){
            res.status(200).send(selectResult)
            return;
        };       
       
        //Assign id and create
        let idDomain = new IdDomain(mongoAdapter);
        let saveIdDomain = await idDomain.Save({Entity:'TaskCounter'},IdData.collection, { $inc: { Counter: 1 }})
        if(!saveIdDomain.IsSuccess){
            res.status(400).send(saveIdDomain); 
            return;
        }
      
        task.id = saveIdDomain.Data;       

        let createResult = await taskDomain.Create(task, TasksData.collection);
        let status = createResult.IsSuccess?200:400;
        res.status(status).send(createResult);        
        
    }catch(err){
        res.status(400).send({IsSucces:false, Message:'Error creating task -->'+err});
    }
      
});

//**  PUT  **/
//Update status
TasksRouter.put(config.baseUrl+'Task/UpdateStatus',  async (req, res) => {
    try{
        console.log(JSON.stringify(req.query))
        const {id, status} = req.query;              
        let mongoAdapter = new MongoDBAdapter(config);
        let taskDomain = new TaskDomain(mongoAdapter);        
        let result =  await taskDomain.FindOneAndUpdate({id:id}, TasksData.collection, {status:status});   
        let statusResult = result.IsSuccess?200:400               
        res.status(statusResult).send(result)
    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Tasks ->'+err, Data: null}));
    }       
});

//Update priority
TasksRouter.put(config.baseUrl+'Task/UpdatePriority',  async (req, res) => {
    try{
        console.log(JSON.stringify(req.query))
        const {id, priority} = req.query;              
        let mongoAdapter = new MongoDBAdapter(config);
        let taskDomain = new TaskDomain(mongoAdapter);        
        let result =  await taskDomain.FindOneAndUpdate({id:id}, TasksData.collection, {priority:priority});   
        let statusResult = result.IsSuccess?200:400               
        res.status(statusResult).send(result)
    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Tasks ->'+err, Data: null}));
    }       
});

//Update description
TasksRouter.put(config.baseUrl+'Task/UpdateDescription',  async (req, res) => {
    try{       
        const {id, description} = req.body;              
        let mongoAdapter = new MongoDBAdapter(config);
        let taskDomain = new TaskDomain(mongoAdapter);        
        let result =  await taskDomain.FindOneAndUpdate({id:id}, TasksData.collection, {description:description});   
        let statusResult = result.IsSuccess?200:400               
        res.status(statusResult).send(result)
    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Tasks ->'+err, Data: null}));
    }       
});

//**  DELETE  **/
//Update priority
TasksRouter.delete(config.baseUrl+'Task/DeleteTask',  async (req, res) => {
    try{    
        const {id} = req.query;              
        let mongoAdapter = new MongoDBAdapter(config);
        let taskDomain = new TaskDomain(mongoAdapter);        
        let result =  await taskDomain.Delete({id:id}, TasksData.collection);   
        let statusResult = result.IsSuccess?200:400               
        res.status(statusResult).send(result)
    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Tasks ->'+err, Data: null}));
    }       
});

export default TasksRouter;
