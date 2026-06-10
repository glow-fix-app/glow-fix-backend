import { BusinessesPresenter } from '../businesses.presenter';

describe('BusinessesPresenter', () => {
  let presenter: BusinessesPresenter;

  beforeEach(() => {
    presenter = new BusinessesPresenter();
  });

  it('groups services by category and converts BigInt price for public profile', () => {
    const result = presenter.toPublicBusinessProfileEntity({
      id: 'business-1',
      businessName: 'Glow Fix',
      address: '123 Main St',
      contactPhone: '+20123456789',
      contactEmail: 'test@example.com',
      latitude: 30.0444,
      longitude: 31.2357,
      createdAt: new Date('2025-01-01T00:00:00.000Z'),
      updatedAt: new Date('2025-01-02T00:00:00.000Z'),
      rating: 4.5,
      reviews_count: 2,
      statusHistory: [{ status: { name: 'APPROVED' } }],
      operatingHours: [{ dayOfWeek: 1, openTime: '09:00', closeTime: '17:00' }],
      businessServices: [
        {
          id: 'bs-1',
          price: 15000n,
          averageDuration: 30,
          isActive: true,
          service: {
            id: 'service-1',
            title: 'Exterior Wash',
            description: 'Wash',
            category: { id: 'cat-1', name: 'Car Wash' },
          },
        },
        {
          id: 'bs-2',
          price: 20000n,
          averageDuration: 40,
          isActive: true,
          service: {
            id: 'service-2',
            title: 'Interior Wash',
            description: 'Wash',
            category: { id: 'cat-1', name: 'Car Wash' },
          },
        },
      ],
    });

    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].services_count).toBe(2);
    expect(result.categories[0].services[0].price).toBe(150);
    expect(typeof result.categories[0].services[0].price).toBe('number');
    expect((result as any).managerId).toBeUndefined();
  });
});
