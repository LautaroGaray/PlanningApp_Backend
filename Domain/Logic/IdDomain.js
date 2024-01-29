
export default class IdDomain{
    constructor(dbAdapt){
        this.dbAdapter = dbAdapt;        
    }
    Save = async (options, entity, optionsValue) => {
        try {
            let result = await this.dbAdapter.FindOneAndUpdate(options, entity, optionsValue);              
            if (result.IsSuccess) {           
                return { IsSuccess: true, Data: result.Data.Counter };
            } else {
                let creating = await this.dbAdapter.Create({Entity:options.Entity, Counter:1}, entity);                              
                if (!creating.IsSuccess){
                    return { IsSuccess: false, Message: 'error creating id: ' + result.Message };
                }else{
                    return {IsSuccess:true, Data:creating.Data.Counter}
                }               
            }
        } catch (err) {            
            return { IsSuccess: false, Message: 'Error saving the  ID: ' + err };
        }
    }   
    Select = async(options, entity)=>{
        try{
            let result = await this.dbAdapter.Select(options, entity);
            if(result = []){
                return {IsSuccess: false, Message: 'No Tasks data', Data: result};
            }else{
                return {IsSuccess: true, Message: '', Data: result};
            }
            
        }catch(err){
            return {IsSuccess:false, Message: 'Error in GetAll Task ->'+err, Data:null};
        }
     }

}