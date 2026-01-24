import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  GetSubscriptionUseCase,
  UpgradePlanUseCase,
  DowngradePlanUseCase,
  PurchaseCreditsUseCase,
} from '../subscription.use-cases';
import { SubscriptionRepository } from '../../../domain/repositories/subscription.repository.interface';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../../../domain/entities/subscription.entity';

describe('Subscription Use Cases', () => {
  let getUseCase: GetSubscriptionUseCase;
  let upgradeUseCase: UpgradePlanUseCase;
  let downgradeUseCase: DowngradePlanUseCase;
  let purchaseUseCase: PurchaseCreditsUseCase;
  let subscriptionRepository: jest.Mocked<SubscriptionRepository>;

  const mockSubscription = new Subscription(
    {
      userId: 'user-id-123',
      plan: SubscriptionPlan.FREE,
      status: SubscriptionStatus.ACTIVE,
      credits: 50,
    },
    'sub-id-123',
  );

  beforeEach(async () => {
    const mockSubscriptionRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSubscriptionUseCase,
        UpgradePlanUseCase,
        DowngradePlanUseCase,
        PurchaseCreditsUseCase,
        { provide: 'SubscriptionRepository', useValue: mockSubscriptionRepository },
      ],
    }).compile();

    getUseCase = module.get<GetSubscriptionUseCase>(GetSubscriptionUseCase);
    upgradeUseCase = module.get<UpgradePlanUseCase>(UpgradePlanUseCase);
    downgradeUseCase = module.get<DowngradePlanUseCase>(DowngradePlanUseCase);
    purchaseUseCase = module.get<PurchaseCreditsUseCase>(PurchaseCreditsUseCase);
    subscriptionRepository = module.get('SubscriptionRepository');
  });

  describe('GetSubscriptionUseCase', () => {
    it('should be defined', () => {
      expect(getUseCase).toBeDefined();
    });

    it('should return subscription for user', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(mockSubscription);

      const result = await getUseCase.execute('user-id-123');

      expect(subscriptionRepository.findByUserId).toHaveBeenCalledWith('user-id-123');
      expect(result).toHaveProperty('id', mockSubscription.id);
      expect(result).toHaveProperty('plan', 'free');
      expect(result).toHaveProperty('credits', 50);
    });

    it('should return null if no subscription found', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(null);

      const result = await getUseCase.execute('user-id-123');

      expect(result).toBeNull();
    });
  });

  describe('UpgradePlanUseCase', () => {
    it('should be defined', () => {
      expect(upgradeUseCase).toBeDefined();
    });

    it('should upgrade plan to PRO and add credits', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(mockSubscription);
      subscriptionRepository.save.mockResolvedValue();

      const result = await upgradeUseCase.execute('user-id-123', 'pro');

      expect(subscriptionRepository.findByUserId).toHaveBeenCalledWith('user-id-123');
      expect(subscriptionRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('success', true);
      expect(result.subscription).toHaveProperty('plan', 'pro');
    });

    it('should throw NotFoundException if subscription not found', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(null);

      await expect(upgradeUseCase.execute('user-id-123', 'pro')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for invalid plan', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(mockSubscription);

      await expect(
        upgradeUseCase.execute('user-id-123', 'invalid_plan'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('DowngradePlanUseCase', () => {
    it('should be defined', () => {
      expect(downgradeUseCase).toBeDefined();
    });

    it('should downgrade plan to FREE', async () => {
      const proSubscription = new Subscription(
        {
          userId: 'user-id-123',
          plan: SubscriptionPlan.PRO,
          status: SubscriptionStatus.ACTIVE,
          credits: 500,
        },
        'sub-id-123',
      );

      subscriptionRepository.findByUserId.mockResolvedValue(proSubscription);
      subscriptionRepository.save.mockResolvedValue();

      const result = await downgradeUseCase.execute('user-id-123');

      expect(result).toHaveProperty('success', true);
      expect(result.subscription).toHaveProperty('plan', 'free');
    });

    it('should throw NotFoundException if subscription not found', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(null);

      await expect(downgradeUseCase.execute('user-id-123')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('PurchaseCreditsUseCase', () => {
    it('should be defined', () => {
      expect(purchaseUseCase).toBeDefined();
    });

    it('should purchase starter package credits', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(mockSubscription);
      subscriptionRepository.save.mockResolvedValue();

      const result = await purchaseUseCase.execute('user-id-123', 'starter');

      expect(result).toHaveProperty('success', true);
      expect(result.total_credits).toBe(150); // 50 existing + 100 starter
    });

    it('should purchase popular package with bonus', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(mockSubscription);
      subscriptionRepository.save.mockResolvedValue();

      const result = await purchaseUseCase.execute('user-id-123', 'popular');

      expect(result.total_credits).toBe(600); // 50 + 500 + 50 bonus
    });

    it('should throw NotFoundException if subscription not found', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(null);

      await expect(
        purchaseUseCase.execute('user-id-123', 'starter'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid package', async () => {
      subscriptionRepository.findByUserId.mockResolvedValue(mockSubscription);

      await expect(
        purchaseUseCase.execute('user-id-123', 'invalid_package'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
