import {Router} from 'express';
import config from '../config.js';

//Domain Layer
import TaskDomain from '../Domain/Logic/TaskDomain.js';
import TasksData from '../Domain/Entities/TasksData.js'
import IdDomain from '../Domain/Logic/IdDomain.js';
import IdData from '../Domain/Entities/IdData.js';
import GroupDomain from '../Domain/Logic/GroupDomain.js';
import GroupData from '../Domain/Entities/GroupData.js';
import ProjectDomain from '../Domain/Logic/ProjectDomain.js';
import ProjectData from '../Domain/Entities/ProjectData.js';

 //Helpers
 import EntityHelper from '../Domain/Helpers/EntityHelper.js'

 //Adapter Layer
import MongoDBAdapter from '../Adapters/MongoDBAdapter.js';


 const ProjectRouter = Router();

//**  GET  **/
//Get All Data
ProjectRouter.get(config.baseUrl+'Project/GetAll',  async (req, res) => {
    try{
        let mongoAdapter = new MongoDBAdapter(config);
        let projectDomain = new ProjectDomain(mongoAdapter);   

        let result = await projectDomain.Select(null, ProjectData.collection);
        let status = result.IsSuccess?200:400        
        res.status(status).send(result)         

    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Projects ->'+err, Data: null}));
    }       
});
//Get All Count
ProjectRouter.get(config.baseUrl+'Project/GetGroups',  async (req, res) => {
    try{
        let mongoAdapter = new MongoDBAdapter(config);
        let groupDomain = new GroupDomain(mongoAdapter); 
        let projectDomain = new ProjectDomain(mongoAdapter);          
       
        const {projectName} = req.query;
        let projectResultPersisted = true;

        let projectResult = await projectDomain.Select({projectName:projectName}, ProjectData.collection);
        if( !projectResult.IsSuccess){            
           projectResultPersisted = false; 
        }       
        let id = projectResult.Data.length > 0?projectResult.Data[0].idProject:0;        
        let result = await groupDomain.Select({idProject:id}, GroupData.collection);
        console.log(JSON.stringify(result));
        let status = result.IsSuccess?200:400      
       if(!projectResultPersisted){        
             res.status(400).send(projectResultPersisted);      
       }else{        
            res.status(status).send(result);
       }          
    }catch(err){
        console.log(err);
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Projects ->'+err, Data: null}));
    }       
});

 //**  POST  **/
//Create Project
ProjectRouter.post(config.baseUrl+'Project/CreateProject', async(req,res)=>{
    try{
        
        let mongoAdapter = new MongoDBAdapter(config);   
        let entityHelper = new EntityHelper();    
        let project = entityHelper.CreateEntity_Project(req.body);          

        //Validations
        if((project.projectName.trim() === '') ){            
            res.status(400).send({IsSuccess:false, Message:'Name is required'});
            return;
        }       
        
        //Check if exists
        let projectDomain = new ProjectDomain(mongoAdapter);
        let selectResult = await projectDomain.SelectOne({projectName:project.projectName}, ProjectData.collection);
        if(selectResult.IsSuccess){
            res.status(200).send(selectResult)
            return;
        };              
        
        //Assign id and create
        let idDomain = new IdDomain(mongoAdapter);
        let saveIdDomain = await idDomain.Save({Entity:'ProjectCounter'},IdData.collection, { $inc: { Counter: 1 }})
        if(!saveIdDomain.IsSuccess){
            res.status(400).send(saveIdDomain); 
            return;
        }
      
        project.idProject = saveIdDomain.Data;       

        let createResult = await projectDomain.Create(project, ProjectData.collection);
        console.log(JSON.stringify(createResult));
        let status = createResult.IsSuccess?200:400;
        res.status(status).send(createResult);        
        
    }catch(err){
        console.log(err);
        res.status(400).send({IsSucces:false, Message:'Error creating project -->'+err});
    }
      
});

//**  DELETE  **/
//Delete project
ProjectRouter.delete(config.baseUrl+'Project/DeleteProject',  async (req, res) => {
    try{
      
        let mongoAdapter = new MongoDBAdapter(config);
        let projectDomain = new ProjectDomain(mongoAdapter); 
        const {projectName} = req.query  
       
        let result = await projectDomain.Delete({projectName:projectName}, ProjectData.collection);
        if(!result.IsSuccess){
            res.status(400).send(result)        
        }        
       
        res.status(200).send(result);         

    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error deleting Projects ->'+err, Data: null}));
    }       
});

export default ProjectRouter;