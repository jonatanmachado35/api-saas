"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = exports.PaymentFrequency = exports.PaymentType = exports.PaymentStatus = void 0;
const base_classes_1 = require("../../../../core/base-classes");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELED"] = "CANCELED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["SUBSCRIPTION"] = "SUBSCRIPTION";
    PaymentType["CREDITS"] = "CREDITS";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var PaymentFrequency;
(function (PaymentFrequency) {
    PaymentFrequency["ONE_TIME"] = "ONE_TIME";
    PaymentFrequency["MONTHLY"] = "MONTHLY";
})(PaymentFrequency || (exports.PaymentFrequency = PaymentFrequency = {}));
class Payment extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get userId() { return this.props.userId; }
    get type() { return this.props.type; }
    get amount() { return this.props.amount; }
    get description() { return this.props.description; }
    get status() { return this.props.status; }
    get frequency() { return this.props.frequency; }
    get externalId() { return this.props.externalId; }
    get paymentUrl() { return this.props.paymentUrl; }
    get metadata() { return this.props.metadata; }
    markAsPaid(externalId) {
        this.props.status = PaymentStatus.PAID;
        this.props.externalId = externalId;
        this.props.updatedAt = new Date();
    }
    markAsFailed() {
        this.props.status = PaymentStatus.FAILED;
        this.props.updatedAt = new Date();
    }
    cancel() {
        this.props.status = PaymentStatus.CANCELED;
        this.props.updatedAt = new Date();
    }
}
exports.Payment = Payment;
//# sourceMappingURL=payment.entity.js.map