import GroupData from './GroupData.js';

export default class ProjectData {
    static get collection() {
        return 'ProjectData';
    }
    static get scheme() {
        return {
            idProject: { type: Number, default: 0 },
            projectName: { type: String, default: '' },
            projectColor: String,
            groups: { type: [GroupData.scheme], default: [] }
        };
    }
}

