
import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderInquiryViewModelResponse } from '../view-models/order-inquiry-response.viewmodel';
import { OrderInquiryViewModel } from '../view-models/order-inquiry.viewmodel';
import { OrdersViewModel } from '../view-models/order-inquiry.viewmodel';

import { HttpService } from '../services/http.service';
import { AlertService } from '../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  
  public title = 'Orders';
  public orderInquiryViewModel: OrderInquiryViewModel;
 
  constructor(private router: Router, private httpService: HttpService, private alertService: AlertService) {

    this.orderInquiryViewModel = new OrderInquiryViewModel();
    this.orderInquiryViewModel.displayedColumns =
      ['orderNumber','orderDate','customerName','productNumber','description','orderQuantity','unitPrice'];

  }

  ngOnInit() {
    this.initializeSearch();
    this.executeSearch();
  }

  private initializeSearch() {
    this.orderInquiryViewModel.orders = new Array<OrdersViewModel>();

  }

  private executeSearch() {

    let url = 'https://localhost:44340/api/' + 'onlinestore/GetOrders';
    this.httpService.HttpGet<OrderInquiryViewModelResponse>(url).
      subscribe((response: OrderInquiryViewModelResponse) => {
        this.orderInquirySuccess(response);
      }, response => this.orderInquiryFailed(response));

  }

  private orderInquirySuccess(response: OrderInquiryViewModelResponse) {
    this.orderInquiryViewModel.orders = response.entity;
  }

  private orderInquiryFailed(error: HttpErrorResponse) {
    let errorResponse: OrderInquiryViewModelResponse = error.error;
    if (error.status > 0) {
      this.alertService.ShowErrorMessage(errorResponse.returnMessage[0]);
    } else {
      this.alertService.ShowErrorMessage(error.message);
    }
  }

}

