import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Tour } from 'src/app/common/Tour';
import { CategoryService } from 'src/app/services/category.service';
import { TourService } from 'src/app/services/tour.service';
import { UploadService } from 'src/app/services/upload.service';
import { TourStatus } from 'src/app/common/TourStatus';

@Component({
  selector: 'app-close-tour',
  templateUrl: './close-tour.component.html',
  styleUrls: ['./close-tour.component.css']
})
export class CloseTourComponent implements OnInit {

  tour!: Tour;
  tourStatus!: TourStatus;

  selectFile!: File;
  url: string = 'LinkImage';
  image: string = this.url;

  postForm: FormGroup;
  closeForm: FormGroup;
  categories!: Category[];

  @Input() id!: number;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private tourService: TourService, private toastr: ToastrService, private uploadService: UploadService) {
    this.closeForm = new FormGroup({
      'tour_Id': new FormControl(0),
      'from_Date': new FormControl(null, Validators.required),
      'to_Date': new FormControl(null, Validators.required),
    });
    this.postForm = new FormGroup({
      'tourId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
      'price': new FormControl(null, [Validators.required, Validators.min(1000)]),
      'discount': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      'description': new FormControl(null, Validators.required),
      'enteredDate': new FormControl(new Date()),
      'categoryId': new FormControl(1),
      'status': new FormControl(1),
      'sold': new FormControl(0),
    })
  }

  ngOnInit(): void {
    this.getCategories();
    this.getTour();
  }

  // update() {
  //   if(this.postForm.valid) {
  //     this.tour = this.postForm.value;
  //     this.tour.category = new Category(this.postForm.value.categoryId, '');
  //     this.tour.image = this.image;
      
  //     this.tourService.update(this.tour, this.id).subscribe(data=>{
  //       this.toastr.success('Cập nhật thành công!', 'Hệ thống');
  //       this.editFinish.emit('done');
  //     })
  //   } else {
  //     this.toastr.error('Hãy kiểm tra lại dữ liệu!', 'Hệ thống');
  //   }
  //   this.modalService.dismissAll();
  // }
  closeTour() {
    if(this.closeForm.valid) {
      // const tourStatus = {
      //   ...this.closeForm.value,
      //   fromDate: this.closeForm.get('fromDate')?.value,
      //   toDate: this.closeForm.get('toDate')?.value
      // };
      const formattedFromDate = this.formatDateToString(this.closeForm.get('from_Date')?.value);
      const formattedToDate = this.formatDateToString(this.closeForm.get('to_Date')?.value);
      this.tourStatus = this.closeForm.value;
      this.tourStatus.tourId = this.id;
      this.tourStatus.fromDate = formattedFromDate;
      this.tourStatus.toDate = formattedToDate;

      this.tourService.closeTour(this.tourStatus).subscribe(data => {
        this.toastr.success('Cập nhật thành công!', 'Hệ thống');
        this.editFinish.emit('done');
        this.modalService.dismissAll();
      });
    } else {
      this.toastr.error('Hãy kiểm tra lại dữ liệu!', 'Hệ thống');
    }
  }
  formatDateToString(date: Date): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTour() {
    this.tourService.getOne(this.id).subscribe(data => {
      this.tour = data as Tour;
      this.postForm = new FormGroup({
        'tourId': new FormControl(this.tour.tourId),
        'name': new FormControl(this.tour.name, [Validators.minLength(4), Validators.required]),
        'quantity': new FormControl(this.tour.quantity, [Validators.min(1), Validators.required]),
        'price': new FormControl(this.tour.price, [Validators.required, Validators.min(1000)]),
        'discount': new FormControl(this.tour.discount, [Validators.required, Validators.min(0), Validators.max(100)]),
        'description': new FormControl(this.tour.description, Validators.required),
        'enteredDate': new FormControl(this.tour.enteredDate),
        'categoryId': new FormControl(this.tour.category.categoryId),
        'status': new FormControl(1),
        'sold': new FormControl(this.tour.sold),
      })
      this.image = this.tour.image;
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu! ', 'Hệ thống');
    })
  }

  getCategories() {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data as Category[];
    }, error => {
      this.toastr.error('Lỗi truy xuất dữ liệu, bấm f5!', 'Hệ thống');
    })
  }

  onFileSelect(event: any) {
    this.selectFile = event.target.files[0];
    this.uploadService.uploadTour(this.selectFile).subscribe(response => {
      if (response) {
        this.image = response.secure_url;
      }
    })
  }

  open(content: TemplateRef<any>) {
    // this.modalService.open(content, { centered: true, size: 'lg' });
    this.modalService.open(content, {
      centered: true, size: 'lg',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      windowClass: 'modal-container'  // Add this line
    });
  }

}
