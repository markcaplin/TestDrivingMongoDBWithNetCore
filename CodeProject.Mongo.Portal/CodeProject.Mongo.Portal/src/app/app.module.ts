import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProductSearchComponent } from './productsearch/product-search.component';
import { ProductDetailComponent } from './productdetail/product-detail.component';
import { ShoppingCartComponent } from './shoppingcart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';

import { HttpService } from './services/http.service';
import { AlertService } from './services/alert.service';

import { ApplicationRoutes } from './routing/routing.component';

import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    AppComponent,
    ProductSearchComponent,
    ProductDetailComponent,
    HomeComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    OrdersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ApplicationRoutes),
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule, HttpClientModule, BrowserAnimationsModule],
  providers: [HttpService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
