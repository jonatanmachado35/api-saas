"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const crypto_1 = require("crypto");
class Entity {
    _id;
    props;
    constructor(props, id) {
        this._id = id ? id : (0, crypto_1.randomUUID)();
        this.props = props;
    }
    get id() {
        return this._id;
    }
}
exports.Entity = Entity;
//# sourceMappingURL=base-classes.js.map