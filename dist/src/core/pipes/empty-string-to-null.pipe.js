"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyStringToNullPipe = void 0;
const common_1 = require("@nestjs/common");
let EmptyStringToNullPipe = class EmptyStringToNullPipe {
    transform(value, metadata) {
        if (typeof value === 'object' && value !== null) {
            return this.transformObject(value);
        }
        return value;
    }
    transformObject(obj) {
        const result = { ...obj };
        for (const key in result) {
            if (result[key] === '' || result[key] === null) {
                result[key] = undefined;
            }
        }
        return result;
    }
};
exports.EmptyStringToNullPipe = EmptyStringToNullPipe;
exports.EmptyStringToNullPipe = EmptyStringToNullPipe = __decorate([
    (0, common_1.Injectable)()
], EmptyStringToNullPipe);
//# sourceMappingURL=empty-string-to-null.pipe.js.map