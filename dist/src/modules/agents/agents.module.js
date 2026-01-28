"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_agent_repository_1 = require("./infra/repositories/prisma-agent.repository");
const prisma_llm_repository_1 = require("./infra/repositories/prisma-llm.repository");
const agent_controller_1 = require("./infra/http/controllers/agent.controller");
const llm_controller_1 = require("./infra/http/controllers/llm.controller");
const agent_use_cases_1 = require("./application/use-cases/agent.use-cases");
const llm_use_cases_1 = require("./application/use-cases/llm.use-cases");
const iam_module_1 = require("../iam/iam.module");
let AgentsModule = class AgentsModule {
};
exports.AgentsModule = AgentsModule;
exports.AgentsModule = AgentsModule = __decorate([
    (0, common_1.Module)({
        imports: [iam_module_1.IamModule],
        controllers: [agent_controller_1.AgentController, llm_controller_1.LlmController, llm_controller_1.AdminLlmController],
        providers: [
            {
                provide: 'AgentRepository',
                useClass: prisma_agent_repository_1.PrismaAgentRepository,
            },
            {
                provide: 'LlmRepository',
                useClass: prisma_llm_repository_1.PrismaLlmRepository,
            },
            agent_use_cases_1.CreateAgentUseCase,
            agent_use_cases_1.UpdateAgentUseCase,
            agent_use_cases_1.ListAgentsUseCase,
            agent_use_cases_1.DeleteAgentUseCase,
            llm_use_cases_1.ListLlmsUseCase,
            llm_use_cases_1.GetLlmByIdUseCase,
            llm_use_cases_1.CreateLlmUseCase,
            llm_use_cases_1.UpdateLlmUseCase,
            llm_use_cases_1.DeleteLlmUseCase,
        ],
        exports: ['AgentRepository', 'LlmRepository'],
    })
], AgentsModule);
//# sourceMappingURL=agents.module.js.map