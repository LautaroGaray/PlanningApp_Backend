import TasksData from './TasksData.js';

class GroupData {
    static get collection() {
        return 'GroupData';
    }
    static get scheme() {
        return {
            id: Number,
            idProject: {type:Number, default:0},
            name: String,
            tasks: {type:[TasksData.scheme], default: []}
        };
    }
}

export default GroupData;