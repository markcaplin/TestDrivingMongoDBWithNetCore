
import { ResponseModel } from './response.model';
import { OrdersViewModel } from './order-inquiry.viewmodel';

export class OrderInquiryViewModelResponse extends ResponseModel {
  public entity: Array<OrdersViewModel>;
}
