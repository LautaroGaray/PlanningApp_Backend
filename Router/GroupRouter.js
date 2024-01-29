import {Router} from 'express';
import config from '../config.js';

//Domain Layer
import TaskDomain from '../Domain/Logic/TaskDomain.js';
import TasksData from '../Domain/Entities/TasksData.js'
import IdDomain from '../Domain/Logic/IdDomain.js';
import IdData from '../Domain/Entities/IdData.js';
import GroupDomain from '../Domain/Logic/GroupDomain.js';
import GroupData from '../Domain/Entities/GroupData.js';

 //Helpers
 import EntityHelper from '../Domain/Helpers/EntityHelper.js'

 //Adapter Layer
import MongoDBAdapter from '../Adapters/MongoDBAdapter.js';

 const GroupRouter = Router();

//**  GET  **/
//Get All Data
GroupRouter.get(config.baseUrl+'Group/GetAll',  async (req, res) => {
    try{
        let mongoAdapter = new MongoDBAdapter(config);
        let groupDomain = new GroupDomain(mongoAdapter);   

        let result = await groupDomain.Select(null, GroupData.collection);
        let status = result.IsSuccess?200:400        
        res.status(status).send(result)         

    }catch(err){
        res.status(400).send(JSON.parse({Issuccess:false, Message:'Error Getting All Tasks ->'+err, Data: null}));
    }       
});

 //**  POST  **/
//Create Group
GroupRouter.post(config.baseUrl+'Group/CreateGroup', async(req,res)=>{
    try{
        
        let mongoAdapter = new MongoDBAdapter(config);   
        let entityHelper = new EntityHelper();    
        let group = entityHelper.CreateEntity_Group(req.body);          

        //Validations
        if((group.name.trim() === '') ){            
            res.status(400).send({IsSuccess:false, Message:'Name is required'});
            return;
        }       
        
        //Check if exists
        let groupDomain = new GroupDomain(mongoAdapter);
        let selectResult = await groupDomain.SelectOne({name:group.name}, GroupData.collection);
        if(selectResult.IsSuccess){
            res.status(200).send(selectResult)
            return;
        };              
        
        //Assign id and create
        let idDomain = new IdDomain(mongoAdapter);
        let saveIdDomain = await idDomain.Save({Entity:'GroupCounter'},IdData.collection, { $inc: { Counter: 1 }})
        if(!saveIdDomain.IsSuccess){
            res.status(400).send(saveIdDomain); 
            return;
        }
      
        group.id = saveIdDomain.Data;       

        let createResult = await groupDomain.Create(group, GroupData.collection);
        console.log(JSON.stringify(createResult));
        let status = createResult.IsSuccess?200:400;
        res.status(status).send(createResult);        
        
    }catch(err){
        console.log(err);
        res.status(400).send({IsSucces:false, Message:'Error creating group -->'+err});
    }
      
});

export default GroupRouter;