
import { ResponseModel } from './response.model';
import { ProductViewModel } from './product.viewmodel';

export class ProductDetailViewModelResponse extends ResponseModel {
  public entity: ProductViewModel;
}
