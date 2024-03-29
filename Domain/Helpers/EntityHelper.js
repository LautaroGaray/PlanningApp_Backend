import TasksData from "../Entities/TasksData.js";
import DateTimeNow from "./DateHelper.js";

class EntityHelper{

  CreateEntity_Task(obj){
        try{
            const {id, name, description, agent, dateAdd, dateModified, status, priority, idGroup, idProject} = obj;

            let entity = {
                id: id?id:0,
                idGroup:idGroup?idGroup:0,
                idProject:idProject?idProject:0,
                name:name?name:'',
                description:description?description:'',
                status:status?status:0,
                priority:priority?priority:'LOW',
                dateAdd:dateAdd?dateAdd:DateTimeNow(),
                dateModified:dateModified?dateModified:'',
                agent:agent?agent:''
            };       

            return entity;
            
        }catch(err){
            console.log(err);
            throw new Error(err)
        }
    }  

    CreateEntity_Group(obj){
        try{
            const {id, idProject, name, tasks} = obj;

            let entity = {
                id: id?id:0,               
                idProject:idProject?idProject:0,
                name:name?name:'',
                tasks:tasks?tasks:[]               
            };       

            return entity;
            
        }catch(err){
            console.log(err);
            throw new Error(err)
        }
    }  

    CreateEntity_Project(obj){
        try{
            const {idProject, projectName, projectColor} = obj;

            let entity = {
                idProject: idProject?idProject:0,                  
                projectName:projectName?projectName:''  ,
                projectColor:projectColor?projectColor:'white'           
            };       

            return entity;
            
        }catch(err){
            console.log(err);
            throw new Error(err)
        }
    }  
}

export default EntityHelper;
    
