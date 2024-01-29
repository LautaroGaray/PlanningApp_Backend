import mongoose from 'mongoose'
import TasksData from '../Domain/Entities/TasksData.js';
import GroupData from '../Domain/Entities/GroupData.js'
import ProjectData from '../Domain/Entities/ProjectData.js'
import IdData from '../Domain/Entities/IdData.js';


export default class MongoAdapter{
    constructor(config) {       
            this.mongoose = mongoose.connect(`${config.mongo.ConnectionString}`);
            this.models = {};
            this.initializeModels();
        }
    
        initializeModels() {
            this.initializeModel(TasksData.collection, TasksData.scheme);
            this.initializeModel(GroupData.collection, GroupData.scheme);
            this.initializeModel(ProjectData.collection, ProjectData.scheme);
            this.initializeModel(IdData.collection, IdData.scheme);
        }
    
        initializeModel(collectionName, scheme) {
            if (!mongoose.models[collectionName]) {
                this.models[collectionName] = mongoose.model(collectionName, new mongoose.Schema(scheme));
            } else {
                this.models[collectionName] = mongoose.models[collectionName];
            }
        }

    Select = async(options, entity) =>{
        if(!this.models[entity]){
            throw new Error('La entidad no existe');
        }
        try{
            if(!options){
                let resultAll = await this.models[entity].find().lean();                
                return {IsSuccess: true, Data:resultAll};
            }
            let result = await this.models[entity].find(options).lean();
            return {IsSuccess: true, Data:result};

        }catch(err){
            return {IsSuccess:false, Message:'Error select adapter ->'+err};
        }
        
    }
    SelectOne = async(options, entity)=>{
        if(!this.models[entity]){
            throw new Error('La entidad no existe');
        }
        try{
            let result = await this.models[entity].findOne(options).lean();            
            if (result) {              
                return { IsSuccess: true, Data: result };
            } else {                
                return { IsSuccess: false, Message: 'No se encontró ningún documento.' };
            }

        }catch(err){
            return {IsSuccess:false, Message:'Error select one adapter ->'+err};
        }
        
    }
    Create = async(options, entity)=>{
        if(!this.models[entity]){
            throw new Error('La entidad no existe');
        }
        try{
            let result = await this.models[entity].create(options);            
            if(result){
                return {IsSuccess:true, Data:result};
            }else{
                return {IsSuccess:false, Message:'Cannt create data'}
            }     

        }catch(err){
            return {IsSuccess:false, Message:'Error creating one adapter ->'+err};
        }        
    }
    FindOneAndUpdate = async(options, entity, otionsValue)=>{
        if(!this.models[entity]){
            throw new Error('La entidad no existe');
        }

        try{
            let result = await this.models[entity].findOneAndUpdate(options, otionsValue).lean();            
            if(result){
                return {IsSuccess:true, Data:result};
            }else{
                return {IsSuccess:false, Message:'Cannt find document for saving'}
            }                     

        }catch(err){
            return {IsSuccess:false, Message:'Error finding and saving one adapter ->'+err};
        }        
    }
    Delete = async(options, entity)=>{
        try{
            if(!this.models[entity]){
                throw new Error('La entidad no existe');
            }
            let result = await this.models[entity].deleteOne(options).lean();           
            if(result.deletedCount > 0){
                return {IsSuccess: true , Data: result.deletedCount};
            }else{
                return {IsSuccess: false, Message: 'No Tasks data'};
            }           
            return result;

        }catch(err){
            console.log(err);
            return {IsSuccess:false, Message:'Error deleting one adapter ->'+err};
        }   
    }

    Save = async(options, entity) => {
        try {
            
            let result = await this.dbAdapter.updateOne(options, entity, { upsert: true });
            if(result){
                return { IsSuccess: true, Data: result };
            }else{
                return {IsSuccess:false, Message:'Cannt update the object'}
            }            
        } catch (err) {
            return { IsSuccess: false, Message: 'Error saving task -->' + err };
        }
    }

}
