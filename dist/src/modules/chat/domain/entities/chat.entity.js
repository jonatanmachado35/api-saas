"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = exports.Message = exports.MessageSender = void 0;
const base_classes_1 = require("../../../../core/base-classes");
var MessageSender;
(function (MessageSender) {
    MessageSender["USER"] = "USER";
    MessageSender["AGENT"] = "AGENT";
})(MessageSender || (exports.MessageSender = MessageSender = {}));
class Message extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get chatId() { return this.props.chatId; }
    get content() { return this.props.content; }
    get sender() { return this.props.sender; }
}
exports.Message = Message;
class Chat extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get userId() { return this.props.userId; }
    get agentId() { return this.props.agentId; }
    get title() { return this.props.title; }
}
exports.Chat = Chat;
//# sourceMappingURL=chat.entity.js.map