"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const base_classes_1 = require("../../../../core/base-classes");
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["MODERATOR"] = "MODERATOR";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["OWNER"] = "OWNER";
})(UserRole || (exports.UserRole = UserRole = {}));
class User extends base_classes_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    get email() {
        return this.props.email;
    }
    get password() {
        return this.props.password;
    }
    get googleId() {
        return this.props.googleId;
    }
    get fullName() {
        return this.props.fullName;
    }
    get avatarUrl() {
        return this.props.avatarUrl;
    }
    get role() {
        return this.props.role;
    }
    updateProfile(fullName, avatarUrl) {
        if (fullName !== undefined)
            this.props.fullName = fullName;
        if (avatarUrl !== undefined)
            this.props.avatarUrl = avatarUrl;
    }
    changeRole(role) {
        this.props.role = role;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map