import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CategoryComponent } from './category/category.component';
import { TourComponent } from './tour/tour.component';
import { RateComponent } from './rate/rate.component';
import { BookComponent } from './book/book.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { CustomerComponent } from './customer/customer.component';
import { InventoryComponent } from './inventory/inventory.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { ProfileComponent } from './profile/profile.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AddTourComponent } from './add-tour/add-tour.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { EditTourComponent } from './edit-tour/edit-tour.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { AuthGuard } from '../guard/auth.guard';
import { OrderModule } from 'ngx-order-pipe';
import { StatisticalCategoryComponent } from './statistical-category/statistical-category.component';
import { SoldestComponent } from './soldest/soldest.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableExporterModule } from 'mat-table-exporter';
import {CloseTourComponent} from './close-tour/close-tour.component';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const routes: Routes = [
  {
    path: 'admin', component: AdminComponent,
    children : [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
      { path: 'tour', component: TourComponent, canActivate: [AuthGuard] },
      { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] },
      { path: 'rate', component: RateComponent, canActivate: [AuthGuard] },
      { path: 'inventory', component: InventoryComponent, canActivate: [AuthGuard] },
      { path: 'statistical-category', component: StatisticalCategoryComponent, canActivate: [AuthGuard] },
      { path: 'soldest', component: SoldestComponent, canActivate: [AuthGuard] },
      { path: 'book', component: BookComponent, canActivate: [AuthGuard] }
    ]
  }

]

@NgModule({
  declarations: [
    AdminComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    SidebarComponent,
    CategoryComponent,
    TourComponent,
    RateComponent,
    BookComponent,
    BookDetailComponent,
    CustomerComponent,
    InventoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    ProfileComponent,
    AddTourComponent,
    AddCustomerComponent,
    EditTourComponent,
    EditCustomerComponent,
    StatisticalCategoryComponent,
    SoldestComponent,
    CloseTourComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    MatTableModule,
    MatTabsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    OrderModule,
    NgxPaginationModule,
    MatTableExporterModule,
    ToastrModule.forRoot({
      timeOut: 2500,
      // progressBar: true,
      progressAnimation: 'increasing',
      // preventDuplicates: true,
      closeButton: true,
    }),
    RouterModule.forRoot(routes)
  ],
  providers:[AuthGuard]
})
export class AdminModule { }
