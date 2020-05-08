import { Component, OnInit } from '@angular/core';
import { OrderViewModel } from '../view-models/order.viewmodel';
import { ShoppingCartViewModel } from '../view-models/shopping-cart-viewmodel';
import { OrderDetailViewModel } from '../view-models/order-detail.viewmodel';
import { OrderViewModelResponse } from '../view-models/order-response.viewmodel';

import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { AlertService } from '../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'checkout-component',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})

export class CheckoutComponent {

  public title = 'Place Order';
  public orderViewModel: OrderViewModel;
  public orderForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private httpService: HttpService, private alertService: AlertService) {
    this.orderViewModel = new OrderViewModel();

    this.orderForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.orderForm.setValue({
      firstName: '',
      lastName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      zipCode: '',
      email: ''
    });

  }
  

  public placeOrder() {

    let shoppingCartItems: Array<ShoppingCartViewModel> = new Array<ShoppingCartViewModel>();
    const existingShoppingCart: string = localStorage.getItem('MongoShoppingCart');

    if (existingShoppingCart == null) {
      return;
    }

    shoppingCartItems = JSON.parse(existingShoppingCart);
   
    let orderViewModel: OrderViewModel = new OrderViewModel();
    orderViewModel.firstName = this.orderForm.get('firstName').value;
    orderViewModel.lastName = this.orderForm.get('lastName').value;
    orderViewModel.addressLine1 = this.orderForm.get('addressLine1').value;
    orderViewModel.addressLine2 = this.orderForm.get('addressLine2').value;
    orderViewModel.city = this.orderForm.get('city').value;
    orderViewModel.state = this.orderForm.get('state').value;
    orderViewModel.zipCode = this.orderForm.get('zipCode').value;
    orderViewModel.emailAddress = this.orderForm.get('email').value;
    orderViewModel.orderDetails = new Array<OrderDetailViewModel>();

    shoppingCartItems.forEach(detail => {
      let orderDetail = new OrderDetailViewModel();
      orderDetail.productId = detail.productId;
      orderDetail.description = detail.description;
      orderDetail.orderQuantity = detail.orderQuantity;
      orderDetail.productNumber = detail.productNumber;
      orderDetail.unitPrice = detail.unitPrice;
      orderViewModel.orderDetails.push(orderDetail);
    });

    let url = 'https://localhost:44340/api/' + 'onlinestore/createOrder';
    this.httpService.HttpPost<OrderViewModelResponse>(url, orderViewModel).
      subscribe((response: OrderViewModelResponse) => {
        this.createOrderSuccess(response);
      }, response => this.createOrderFailed(response));

  }

  public emptyCart() {
    localStorage.removeItem('MongoShoppingCart');
    this.router.navigate(['/product-search']);
  }

  private createOrderSuccess(response: OrderViewModelResponse) {
    localStorage.removeItem('MongoShoppingCart');
    this.router.navigate(['/orders']);
  }

  private createOrderFailed(error: HttpErrorResponse) {
    let errorResponse: OrderViewModelResponse = error.error;
    if (error.status > 0) {
      this.alertService.ShowErrorMessage(errorResponse.returnMessage[0]);
    } else {
      this.alertService.ShowErrorMessage(error.message);
    }
  }



}
