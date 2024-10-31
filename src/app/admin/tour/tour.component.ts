import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Tour } from 'src/app/common/Tour';
import { PageService } from 'src/app/services/page.service';
import { TourService } from 'src/app/services/tour.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.css']
})
export class TourComponent implements OnInit {

  listData!: MatTableDataSource<Tour>;
  tours!: Tour[];
  toursLength!: number;
  columns: string[] = ['image', 'tourId', 'name', 'price', 'discount', 'category', 'enteredDate', 'view', 'delete'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private tourService: TourService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.pageService.setPageActive('tour');
    this.getAll();
  }

  getAll() {
    this.tourService.getAll().subscribe(data => {
      this.tours = data as Tour[];
      this.listData = new MatTableDataSource(this.tours);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      console.log(error);
    })
  }

  delete(id: number, name: string) {
    Swal.fire({
      title: 'Bạn muốn xoá ' + name + ' ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xoá',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tourService.delete(id).subscribe(data=>{
          this.ngOnInit();
          this.toastr.success('Xoá thành công!', 'Hệ thống');
        },error=>{
          this.toastr.error('Xoá thất bại, đã xảy ra lỗi!', 'Hệ thống');
        })
      }
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.listData.filter = fValue.trim().trim().toLowerCase();

  }

  finish() {
    this.ngOnInit();
  }
}
