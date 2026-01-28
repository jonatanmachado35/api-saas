"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLlmUseCase = exports.UpdateLlmUseCase = exports.CreateLlmUseCase = exports.GetLlmByIdUseCase = exports.ListLlmsUseCase = void 0;
const common_1 = require("@nestjs/common");
const llm_repository_interface_1 = require("../../domain/repositories/llm.repository.interface");
const llm_entity_1 = require("../../domain/entities/llm.entity");
let ListLlmsUseCase = class ListLlmsUseCase {
    llmRepository;
    constructor(llmRepository) {
        this.llmRepository = llmRepository;
    }
    async execute(input = {}) {
        return this.llmRepository.findAll(input.activeOnly);
    }
};
exports.ListLlmsUseCase = ListLlmsUseCase;
exports.ListLlmsUseCase = ListLlmsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LlmRepository')),
    __metadata("design:paramtypes", [llm_repository_interface_1.LlmRepository])
], ListLlmsUseCase);
let GetLlmByIdUseCase = class GetLlmByIdUseCase {
    llmRepository;
    constructor(llmRepository) {
        this.llmRepository = llmRepository;
    }
    async execute(input) {
        const llm = await this.llmRepository.findById(input.id);
        if (!llm) {
            throw new common_1.NotFoundException(`LLM with ID ${input.id} not found`);
        }
        return llm;
    }
};
exports.GetLlmByIdUseCase = GetLlmByIdUseCase;
exports.GetLlmByIdUseCase = GetLlmByIdUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LlmRepository')),
    __metadata("design:paramtypes", [llm_repository_interface_1.LlmRepository])
], GetLlmByIdUseCase);
let CreateLlmUseCase = class CreateLlmUseCase {
    llmRepository;
    constructor(llmRepository) {
        this.llmRepository = llmRepository;
    }
    async execute(input) {
        const llm = new llm_entity_1.Llm({
            name: input.name,
            provider: input.provider,
            model: input.model,
            maxTokens: input.maxTokens,
            active: true,
        });
        return this.llmRepository.create(llm);
    }
};
exports.CreateLlmUseCase = CreateLlmUseCase;
exports.CreateLlmUseCase = CreateLlmUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LlmRepository')),
    __metadata("design:paramtypes", [llm_repository_interface_1.LlmRepository])
], CreateLlmUseCase);
let UpdateLlmUseCase = class UpdateLlmUseCase {
    llmRepository;
    constructor(llmRepository) {
        this.llmRepository = llmRepository;
    }
    async execute(input) {
        const llm = await this.llmRepository.findById(input.id);
        if (!llm) {
            throw new common_1.NotFoundException(`LLM with ID ${input.id} not found`);
        }
        if (input.name !== undefined) {
            llm.updateName(input.name);
        }
        if (input.maxTokens !== undefined) {
            llm.updateMaxTokens(input.maxTokens);
        }
        if (input.active !== undefined) {
            if (input.active) {
                llm.activate();
            }
            else {
                llm.deactivate();
            }
        }
        return this.llmRepository.update(llm);
    }
};
exports.UpdateLlmUseCase = UpdateLlmUseCase;
exports.UpdateLlmUseCase = UpdateLlmUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LlmRepository')),
    __metadata("design:paramtypes", [llm_repository_interface_1.LlmRepository])
], UpdateLlmUseCase);
let DeleteLlmUseCase = class DeleteLlmUseCase {
    llmRepository;
    constructor(llmRepository) {
        this.llmRepository = llmRepository;
    }
    async execute(input) {
        const llm = await this.llmRepository.findById(input.id);
        if (!llm) {
            throw new common_1.NotFoundException(`LLM with ID ${input.id} not found`);
        }
        await this.llmRepository.delete(input.id);
    }
};
exports.DeleteLlmUseCase = DeleteLlmUseCase;
exports.DeleteLlmUseCase = DeleteLlmUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LlmRepository')),
    __metadata("design:paramtypes", [llm_repository_interface_1.LlmRepository])
], DeleteLlmUseCase);
//# sourceMappingURL=llm.use-cases.js.map