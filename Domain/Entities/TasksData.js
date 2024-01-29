class TasksData {
    static get collection() {
        return 'TasksData';
    }
    
    static get scheme() {
        return {
            idGroup: {type:Number, default:0},
            idProject: {type:Number, default:0},
            id: Number,
            name: String,
            description: String,
            status: String,
            priority: { type: String, default: 'LOW' },
            dateAdd: { type: String, default: '' },
            dateModified: { type: String, default: '' },
            agent: { type: String, default: '' }
        };
    }
}

export default TasksData;
