"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = exports.AgentVisibility = void 0;
const base_classes_1 = require("../../../../core/base-classes");
var AgentVisibility;
(function (AgentVisibility) {
    AgentVisibility["PRIVATE"] = "PRIVATE";
    AgentVisibility["PUBLIC"] = "PUBLIC";
    AgentVisibility["PRO_ONLY"] = "PRO_ONLY";
    AgentVisibility["CUSTOM_ONLY"] = "CUSTOM_ONLY";
    AgentVisibility["ADMIN_ONLY"] = "ADMIN_ONLY";
})(AgentVisibility || (exports.AgentVisibility = AgentVisibility = {}));
class Agent extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
        if (!props.visibility) {
            this.props.visibility = AgentVisibility.PRIVATE;
        }
    }
    get userId() {
        return this.props.userId;
    }
    get llmId() {
        return this.props.llmId;
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
    get prompt() {
        return this.props.prompt;
    }
    get category() {
        return this.props.category;
    }
    get type() {
        return this.props.type;
    }
    get tone() {
        return this.props.tone;
    }
    get style() {
        return this.props.style;
    }
    get focus() {
        return this.props.focus;
    }
    get rules() {
        return this.props.rules;
    }
    get visibility() {
        return this.props.visibility;
    }
}
exports.Agent = Agent;
//# sourceMappingURL=agent.entity.js.map