
export class OrdersViewModel {
  public customerName: string;
  public orderDate: Date;
  public productNumber: string;
  public description: string;
  public unitPrice: number;
  public orderQuantity: number;
}

export class OrderInquiryViewModel {
  public orders: Array<OrdersViewModel>;
  public displayedColumns: Array<string>;
}
