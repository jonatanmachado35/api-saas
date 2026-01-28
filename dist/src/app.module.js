"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./modules/prisma/prisma.module");
const shared_module_1 = require("./modules/shared/shared.module");
const iam_module_1 = require("./modules/iam/iam.module");
const subscription_module_1 = require("./modules/subscription/subscription.module");
const payment_module_1 = require("./modules/payment/payment.module");
const agents_module_1 = require("./modules/agents/agents.module");
const chat_module_1 = require("./modules/chat/chat.module");
const admin_module_1 = require("./modules/admin/admin.module");
const contact_module_1 = require("./modules/contact/contact.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            shared_module_1.SharedModule,
            iam_module_1.IamModule,
            subscription_module_1.SubscriptionModule,
            payment_module_1.PaymentModule,
            agents_module_1.AgentsModule,
            chat_module_1.ChatModule,
            admin_module_1.AdminModule,
            contact_module_1.ContactModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map