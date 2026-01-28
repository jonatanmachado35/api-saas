"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Llm = void 0;
const base_classes_1 = require("../../../../core/base-classes");
class Llm extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get name() {
        return this.props.name;
    }
    get provider() {
        return this.props.provider;
    }
    get model() {
        return this.props.model;
    }
    get maxTokens() {
        return this.props.maxTokens;
    }
    get creditCost() {
        return this.props.creditCost;
    }
    get active() {
        return this.props.active;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    activate() {
        this.props.active = true;
        this.props.updatedAt = new Date();
    }
    deactivate() {
        this.props.active = false;
        this.props.updatedAt = new Date();
    }
    updateMaxTokens(maxTokens) {
        if (maxTokens <= 0) {
            throw new Error('Max tokens must be greater than 0');
        }
        this.props.maxTokens = maxTokens;
        this.props.updatedAt = new Date();
    }
    updateCreditCost(creditCost) {
        if (creditCost <= 0) {
            throw new Error('Credit cost must be greater than 0');
        }
        this.props.creditCost = creditCost;
        this.props.updatedAt = new Date();
    }
    updateName(name) {
        if (!name || name.trim().length === 0) {
            throw new Error('Name cannot be empty');
        }
        this.props.name = name;
        this.props.updatedAt = new Date();
    }
}
exports.Llm = Llm;
//# sourceMappingURL=llm.entity.js.map