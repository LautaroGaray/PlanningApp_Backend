import TasksData from "../Entities/TasksData.js";
import DateTimeNow from "./DateHelper.js";

export default function CreateEntity(obj){
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
}