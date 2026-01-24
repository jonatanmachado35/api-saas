"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const base_classes_1 = require("../../../../core/base-classes");
class Agent extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get userId() {
        return this.props.userId;
    }
    get name() {
        return this.props.name;
    }
    get avatar() {
        return this.props.avatar;
    }
    get description() {
        return this.props.description;
    }
}
exports.Agent = Agent;
//# sourceMappingURL=agent.entity.js.map