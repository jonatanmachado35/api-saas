"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = exports.SubscriptionStatus = exports.SubscriptionPlan = void 0;
const base_classes_1 = require("../../../../core/base-classes");
var SubscriptionPlan;
(function (SubscriptionPlan) {
    SubscriptionPlan["FREE"] = "FREE";
    SubscriptionPlan["PRO"] = "PRO";
    SubscriptionPlan["CUSTOM"] = "CUSTOM";
})(SubscriptionPlan || (exports.SubscriptionPlan = SubscriptionPlan = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "ACTIVE";
    SubscriptionStatus["CANCELED"] = "CANCELED";
    SubscriptionStatus["PENDING"] = "PENDING";
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
class Subscription extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get userId() { return this.props.userId; }
    get plan() { return this.props.plan; }
    get status() { return this.props.status; }
    get credits() { return this.props.credits; }
}
exports.Subscription = Subscription;
//# sourceMappingURL=subscription.entity.js.map