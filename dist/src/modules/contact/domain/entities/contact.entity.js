"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const base_classes_1 = require("../../../../core/base-classes");
class Contact extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get name() {
        return this.props.name;
    }
    get email() {
        return this.props.email;
    }
    get company() {
        return this.props.company;
    }
    get subject() {
        return this.props.subject;
    }
    get message() {
        return this.props.message;
    }
    get createdAt() {
        return this.props.createdAt;
    }
}
exports.Contact = Contact;
//# sourceMappingURL=contact.entity.js.map