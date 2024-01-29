import {Router} from 'express';
import config from '../config.js';

//Domain Layer
import TaskDomain from '../Domain/Logic/TaskDomain.js';
import TasksData from '../Domain/Entities/TasksData.js'
import IdDomain from '../Domain/Logic/IdDomain.js';
import IdData from '../Domain/Entities/IdData.js';
 //Helpers
 import EntityHelper from '../Domain/Helpers/EntityHelper.js'


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

//Get By Group
TasksRouter.get(config.baseUrl+'Task/GetByGroup',  async (req, res) => {
    try{
        const {idGroup} = req.query;
        
        let mongoAdapter = new MongoDBAdapter(config);
        let taskDomain = new TaskDomain(mongoAdapter);        
        let result =  await taskDomain.Select({idGroup:idGroup}, TasksData.collection);       
        let status = result.IsSuccess?200:400       
        res.status(status).send(result)
    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting Tasks by group ->'+err, Data: null}));
    }       
});
//**  POST  **/
//Create Task
TasksRouter.post(config.baseUrl+'Task/CreateTask', async(req,res)=>{
    try{
        
        let mongoAdapter = new MongoDBAdapter(config);   
        let entityHelper = new EntityHelper();    
        let task = entityHelper.CreateEntity_Task(req.body);       

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

//Update group
TasksRouter.put(config.baseUrl+'Task/UpdateGroup',  async (req, res) => {
    try{
       
        const {id, idGroup} = req.query;              
        let mongoAdapter = new MongoDBAdapter(config);
        let taskDomain = new TaskDomain(mongoAdapter);        
        let result =  await taskDomain.FindOneAndUpdate({id:id}, TasksData.collection, {idGroup:idGroup});   
        let statusResult = result.IsSuccess?200:400               
        res.status(statusResult).send(result)
    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Tasks ->'+err, Data: null}));
    }       
});

//**  DELETE  **/
//Delete task
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
