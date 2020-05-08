import { Component, OnInit } from '@angular/core';

import { ProductDetailViewModelResponse } from '../view-models/product-detail-response.viewmodel';
import { ProductViewModel } from '../view-models/product.viewmodel';
import { ProductDetailViewModel } from '../view-models/product-detail.viewmodel';
import { ShoppingCartViewModel } from '../view-models/shopping-cart-viewmodel';

import { HttpService } from '../services/http.service';
import { AlertService } from '../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shopping-cart-component',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})

export class ShoppingCartComponent implements OnInit {

  public title = 'Shopping Cart';

  public shoppingCartItems: Array<ShoppingCartViewModel>;
  public displayedColumns: Array<string>;

  constructor(private router: Router) { 
    this.shoppingCartItems = new Array<ShoppingCartViewModel>();
    this.displayedColumns =
      ['productNumber', 'description', 'longDescription', 'orderQuantity', 'unitPrice'];

  }

  ngOnInit() {
    this.loadShoppingCart();
  }

  public loadShoppingCart() {

    let shoppingCartItems: Array<ShoppingCartViewModel> = new Array<ShoppingCartViewModel>();
    const existingShoppingCart: string = localStorage.getItem('MongoShoppingCart');

    if (existingShoppingCart == null) {
      return;
    }

    shoppingCartItems = JSON.parse(existingShoppingCart);

    this.shoppingCartItems = shoppingCartItems;
   
  }

  public checkout(): void {
    this.router.navigate(['/checkout']);
  }


  public emptyCart() {
    localStorage.removeItem('MongoShoppingCart');
    this.router.navigate(['/product-search']);
  }

}
