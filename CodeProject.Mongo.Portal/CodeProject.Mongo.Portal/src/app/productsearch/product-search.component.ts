import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductInquiryViewModelResponse } from '../view-models/product-inquiry-response.viewmodel';
import { ProductViewModel } from '../view-models/product.viewmodel';
import { ProductInquiryViewModel } from '../view-models/product-inquiry.viewmodel';
import { HttpService } from '../services/http.service';
import { AlertService } from '../services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material';

@Component({
  selector: 'product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

  @ViewChild('form') searchForm: NgForm;

  public title = 'Product Search';
  public productInquiryViewModel: ProductInquiryViewModel;
  public selectedRowIndex = -1;

  constructor(private router: Router, private httpService: HttpService, private alertService: AlertService) {

    this.productInquiryViewModel = new ProductInquiryViewModel();
    this.productInquiryViewModel.pageSize = 20;
    this.productInquiryViewModel.displayedColumns =
      ['productNumber', 'description', 'longDescription', 'quantityOnHand', 'unitPrice'];

  }

  ngOnInit() {
    this.initializeSearch();
    this.executeSearch();
  }

  private initializeSearch() {

    this.productInquiryViewModel.productNumber = '';
    this.productInquiryViewModel.description = '';
    this.productInquiryViewModel.currentPageNumber = 1;
    this.productInquiryViewModel.currentPageIndex = 0;
    this.productInquiryViewModel.totalPages = 0;
    this.productInquiryViewModel.totalProducts = 0;
    this.productInquiryViewModel.sortDirection = 'ASC';
    this.productInquiryViewModel.sortExpression = 'Description';
    this.productInquiryViewModel.products = new Array<ProductViewModel>();

  }

  public resetSearch() {
    this.initializeSearch();
    this.executeSearch();
  }

  public filteredSearch() {
    this.productInquiryViewModel.currentPageNumber = 1;
    this.productInquiryViewModel.currentPageIndex = 0;
    this.executeSearch();
  }

  private executeSearch() {

    let productInquiryViewModel = new ProductInquiryViewModel();
    productInquiryViewModel.productNumber = this.productInquiryViewModel.productNumber;
    productInquiryViewModel.description = this.productInquiryViewModel.description;
    productInquiryViewModel.currentPageNumber = this.productInquiryViewModel.currentPageNumber;
    productInquiryViewModel.currentPageIndex = this.productInquiryViewModel.currentPageIndex;
    productInquiryViewModel.sortDirection =  this.productInquiryViewModel.sortDirection;
    productInquiryViewModel.sortExpression = this.productInquiryViewModel.sortExpression;
    productInquiryViewModel.products = this.productInquiryViewModel.products = new Array<ProductViewModel>();

    let url = 'https://localhost:44340/api/' + 'onlinestore/productinquiry';
    this.httpService.HttpPost<ProductInquiryViewModelResponse>(url, productInquiryViewModel).
      subscribe((response: ProductInquiryViewModelResponse) => {
        this.productInquirySuccess(response);
      }, response => this.productInquiryFailed(response));
  }

  private productInquirySuccess(response: ProductInquiryViewModelResponse) {
    this.productInquiryViewModel.products = response.entity;
    this.productInquiryViewModel.totalProducts = response.totalRows;
    this.productInquiryViewModel.totalPages = response.totalPages;
  }

  private productInquiryFailed(error: HttpErrorResponse) {
    let errorResponse: ProductInquiryViewModelResponse = error.error;
    if (error.status > 0) {
      this.alertService.ShowErrorMessage(errorResponse.returnMessage[0]);
    } else {
      this.alertService.ShowErrorMessage(error.message);
    }
  }

  public onPaginateChange(event) {
    this.productInquiryViewModel.currentPageNumber = event.pageIndex + 1;
    this.productInquiryViewModel.currentPageIndex = event.pageIndex;
    this.productInquiryViewModel.pageSize = event.pageSize;
    this.executeSearch();
  }

  public selectProduct(i: number): void {
    let productId = this.productInquiryViewModel.products[i].productId;
    this.router.navigate(['/product-detail'], { queryParams: { id: productId } });
  }

  public sortData(sort: MatSort) {
    this.productInquiryViewModel.currentPageNumber = 1;
    this.productInquiryViewModel.currentPageIndex = 0;
    this.productInquiryViewModel.sortDirection = sort.direction;
    this.productInquiryViewModel.sortExpression = sort.active;
    this.executeSearch();
  }

}
