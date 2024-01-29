

class IdData {
    static get collection() {
        return 'IdData';
    }
    static get scheme() {
        return {            
            Entity: {type:String, default:''},
            Counter: Number         
        };
    }
}

export default IdData;