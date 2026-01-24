"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./infra/http/controllers/admin.controller");
const admin_stats_use_case_1 = require("./application/use-cases/admin-stats.use-case");
const admin_user_use_cases_1 = require("./application/use-cases/admin-user.use-cases");
const admin_mgmt_use_cases_1 = require("./application/use-cases/admin-mgmt.use-cases");
const iam_module_1 = require("../iam/iam.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [iam_module_1.IamModule],
        controllers: [admin_controller_1.AdminController],
        providers: [
            admin_stats_use_case_1.GetAdminStatsUseCase,
            admin_user_use_cases_1.ListUsersUseCase,
            admin_user_use_cases_1.ChangeUserRoleUseCase,
            admin_mgmt_use_cases_1.ListAdminSubscriptionsUseCase,
            admin_mgmt_use_cases_1.CreateAdminSubscriptionUseCase,
            admin_mgmt_use_cases_1.UpdateAdminSubscriptionUseCase,
            admin_mgmt_use_cases_1.ListAllAgentsUseCase,
            admin_mgmt_use_cases_1.CreateAdminAgentUseCase,
            admin_mgmt_use_cases_1.DeleteAdminAgentUseCase,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map