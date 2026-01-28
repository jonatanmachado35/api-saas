"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.ProductType = void 0;
const base_classes_1 = require("../../../../core/base-classes");
var ProductType;
(function (ProductType) {
    ProductType["SUBSCRIPTION"] = "SUBSCRIPTION";
    ProductType["CREDITS"] = "CREDITS";
})(ProductType || (exports.ProductType = ProductType = {}));
class Product extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get type() { return this.props.type; }
    get slug() { return this.props.slug; }
    get name() { return this.props.name; }
    get description() { return this.props.description; }
    get price() { return this.props.price; }
    get credits() { return this.props.credits; }
    get bonus() { return this.props.bonus; }
    get active() { return this.props.active; }
    activate() {
        this.props.active = true;
        this.props.updatedAt = new Date();
    }
    deactivate() {
        this.props.active = false;
        this.props.updatedAt = new Date();
    }
    updatePrice(newPrice) {
        this.props.price = newPrice;
        this.props.updatedAt = new Date();
    }
}
exports.Product = Product;
//# sourceMappingURL=product.entity.js.map