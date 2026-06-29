export interface IServiceRepository {
  readonly category: any;
  readonly service: any;
  readonly businessService: any;
  readonly business: any;
  readonly bookingItem: any;
  $transaction<P extends any[]>(arg: [...P]): Promise<any>;
}
