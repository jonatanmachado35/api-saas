import { GetProfileUseCase, UpdateProfileUseCase } from '../../../application/use-cases/profile.use-cases';
import { CloudinaryService } from '../../../../shared/infra/cloudinary/cloudinary.service';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
export declare class ProfileController {
    private readonly getProfileUseCase;
    private readonly updateProfileUseCase;
    private readonly cloudinaryService;
    constructor(getProfileUseCase: GetProfileUseCase, updateProfileUseCase: UpdateProfileUseCase, cloudinaryService: CloudinaryService);
    getProfile(userId: string): Promise<{
        id: string;
        user_id: string;
        full_name: string | null | undefined;
        avatar_url: string | null | undefined;
        email: string;
        created_at: Date | undefined;
        updated_at: Date | undefined;
    }>;
    updateProfile(userId: string, body: UpdateProfileDto): Promise<{
        success: boolean;
        profile: {
            id: string;
            user_id: string;
            full_name: string | null | undefined;
            avatar_url: string | null | undefined;
            email: string;
            created_at: Date | undefined;
            updated_at: Date;
        };
    }>;
    uploadAvatar(userId: string, file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
