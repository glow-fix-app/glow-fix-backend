export interface IServiceDiscoveryRepository {
  readonly service: any;
  readonly category: any;
  readonly business: any;
  readonly review: any;
  readonly client: any;
  readonly operatingHour: any;
  readonly businessDocument: any;
  readonly image: any;
  queryRaw<T = any>(query: any, ...values: any[]): Promise<T>;
}
