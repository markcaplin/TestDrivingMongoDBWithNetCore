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
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})

export class ProductDetailComponent {

  public title = 'Product Detail';
  public productDetailViewModel: ProductDetailViewModel;
  private routerSubscription: Subscription;
  
  constructor(private route: ActivatedRoute, private router: Router, private httpService: HttpService, private alertService: AlertService) {
    this.productDetailViewModel = new ProductDetailViewModel();
    this.productDetailViewModel.product = new ProductViewModel();
    this.productDetailViewModel.orderQuantity = 1;
  }

  ngOnInit() {

    this.routerSubscription = this.route.queryParams.subscribe(params => {
      let productId: string = params['id'] + "";
      this.getProductDetail(productId);
    });

  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  private getProductDetail(productId: string): void {

    let url = 'https://localhost:44340/api/' + 'onlinestore/getproductdetail/' + productId;
    this.httpService.HttpGet<ProductDetailViewModelResponse>(url).
      subscribe((response: ProductDetailViewModelResponse) => {
        this.getProductDetailSuccess(response);
      }, response => this.getProductDetailFailed(response));
  }


  private getProductDetailSuccess(response: ProductDetailViewModelResponse) {
    this.productDetailViewModel.product = response.entity;
  }

  private getProductDetailFailed(error: HttpErrorResponse) {
    let errorResponse: ProductDetailViewModelResponse = error.error;
    if (error.status > 0) {
      this.alertService.ShowErrorMessage(errorResponse.returnMessage[0]);
    } else {
      this.alertService.ShowErrorMessage(error.message);
    }
  }

  public addToCart() {
    let shoppingCartItems: Array<ShoppingCartViewModel> = new Array<ShoppingCartViewModel>();

    const existingShoppingCart: string = localStorage.getItem('MongoShoppingCart');
  
    if (existingShoppingCart != null) {
      shoppingCartItems = JSON.parse(existingShoppingCart);
    }

    let shoppingCartItem: ShoppingCartViewModel = new ShoppingCartViewModel();

    shoppingCartItem.productId = this.productDetailViewModel.product.productId;
    shoppingCartItem.description = this.productDetailViewModel.product.description;
    shoppingCartItem.longDescription = this.productDetailViewModel.product.longDescription;
    shoppingCartItem.productNumber = this.productDetailViewModel.product.productNumber;
    shoppingCartItem.unitPrice = this.productDetailViewModel.product.unitPrice;
    shoppingCartItem.orderQuantity = this.productDetailViewModel.orderQuantity;

    let existingItem: Array<ShoppingCartViewModel> = shoppingCartItems.filter(c => c.productId == shoppingCartItem.productId);

    if (existingItem.length == 0) {
      shoppingCartItems.push(shoppingCartItem);
    }
    else {
      existingItem[0].orderQuantity = existingItem[0].orderQuantity + shoppingCartItem.orderQuantity;
    }

    let localStorageCart = JSON.stringify(shoppingCartItems);
    localStorage.setItem('MongoShoppingCart', localStorageCart);

    this.router.navigate(['/shopping-cart']);
  }

}
