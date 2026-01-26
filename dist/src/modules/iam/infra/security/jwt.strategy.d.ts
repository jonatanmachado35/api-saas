import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly userRepository;
    constructor(config: ConfigService, userRepository: UserRepository);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        role: import("../../domain/entities/user.entity").UserRole;
        fullName: string | null | undefined;
        avatarUrl: string | null | undefined;
    } | null>;
}
export {};
