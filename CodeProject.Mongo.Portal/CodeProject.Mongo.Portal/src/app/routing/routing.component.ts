import { Routes } from '@angular/router';
import { ProductSearchComponent } from '../productsearch/product-search.component';
import { ProductDetailComponent } from '../productdetail/product-detail.component';
import { ShoppingCartComponent } from '../shoppingcart/shopping-cart.component';
import { CheckoutComponent } from '../checkout/checkout.component';
import { OrdersComponent } from '../orders/orders.component';

import { HomeComponent } from '../home/home.component';

export const ApplicationRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'product-search', component: ProductSearchComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrdersComponent }
];

