

export default class TaskDomain{
    constructor(dbAdapt){
        this.dbAdapter = dbAdapt;        
    }
    Select = async(options, entity)=>{
        try{
            let result = await this.dbAdapter.Select(options, entity);            
            if(result.IsSuccess && result.Data){               
                return {IsSuccess: true , Data: result.Data};
            }else{
                return {IsSuccess: false, Message: 'No Tasks data', Data: null};
            }
            
        }catch(err){
            return {IsSuccess:false, Message: 'Error in GetAll Task ->'+err, Data:null};
        }
     }
     SelectOne = async(options, entity)=>{
        try{
            let result = await this.dbAdapter.SelectOne(options, entity);            
            if(result.IsSuccess && result.Data){               
                return {IsSuccess: true , Data: result.Data};
            }else{
                return {IsSuccess: false, Message: 'No Tasks data', Data: null};
            }
            
        }catch(err){
            return {IsSuccess:false, Message: 'Error in GetAll Task ->'+err, Data:null};
        }
     }


     Create = async(optins, entity)=>{
        try{

            let result = this.dbAdapter.Create(optins, entity);
            return result;
           

        }catch(err){
            return {IsSuccess:false, Message:'Error creating task -->'+err};
        }            
     }

     Save = async(optins, entity)=>{
        try{

            let result = this.dbAdapter.Save(optins, entity);
            return result;

        }catch(err){
            return {IsSuccess:false, Message:'Error saving task -->'+err};
        }            
     }

     FindOneAndUpdate = async(options, entity, optionsValue)=>{
        try{
            let result = await this.dbAdapter.FindOneAndUpdate(options, entity, optionsValue);            
            if(result.IsSuccess && result.Data){
                return result;
            }else{
                return {IsSuccess:false, Message: result.Message? result.Message:'Error find and updating task'};
            }
        }catch(err){
            return {IsSuccess:false, Message:'Exception find and updating task: '+err}
        }
     }  

     Delete = async(options, entity)=>{
        try{
            let result = await this.dbAdapter.Delete(options, entity);                    
            if(result.Data){               
                return {IsSuccess: true , Data: result.deletedCount};
            }else{
                return {IsSuccess: false, Message: 'No Tasks data'};
            }
            
        }catch(err){
            return {IsSuccess:false, Message: 'Error in GetAll Task ->'+err, Data:null};
        }
     }

     UpdateAll = async(options, entity, optionsValue)=>{
        try{
            let result = await this.dbAdapter.UpdateAll(options, entity, optionsValue);                     
            if(result.IsSuccess){
                return result;
            }else{
                return {IsSuccess:false, Message: result.Message? result.Message:'Error find and updating task'};
            }
        }catch(err){
            return {IsSuccess:false, Message:'Exception find and updating task: '+err}
        }
     }

}