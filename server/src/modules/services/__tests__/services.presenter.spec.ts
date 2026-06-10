import { ServicesPresenter } from '../services.presenter';

describe('ServicesPresenter', () => {
  const presenter = new ServicesPresenter();

  it('converts BigInt price to number for assigned business service responses', () => {
    const result = presenter.toAssignedBusinessServiceEntity({
      id: 'business-service-uuid-1',
      businessId: 'business-uuid-1',
      serviceId: 'service-uuid-1',
      price: 15000n,
      averageDuration: 30,
      isActive: true,
      createdAt: new Date('2025-01-01T00:00:00.000Z'),
      updatedAt: new Date('2025-01-02T00:00:00.000Z'),
      business: {
        businessName: 'Glow Fix Garage',
      },
      service: {
        title: 'Exterior Wash',
        description: 'Full exterior wash',
        category: {
          id: 'category-uuid-1',
          name: 'CAR_WASH',
        },
      },
    });

    expect(result.price).toBe(150);
    expect(typeof result.price).toBe('number');
    expect(result.service_title).toBe('Exterior Wash');
  });
});
