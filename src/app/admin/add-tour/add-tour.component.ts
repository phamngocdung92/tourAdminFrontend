import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Tour } from 'src/app/common/Tour';
import { CategoryService } from 'src/app/services/category.service';
import { TourService } from 'src/app/services/tour.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-add-tour',
  templateUrl: './add-tour.component.html',
  styleUrls: ['./add-tour.component.css']
})
export class AddTourComponent implements OnInit {

  tour!: Tour;

  selectFile!: File;
  url: string = 'https://api.cloudinary.com/v1_1/shopdemo/image/upload';
  image: string = this.url;

  postForm: FormGroup;
  categories!: Category[];

  @Output()
  saveFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private tourService: TourService,
    private toastr: ToastrService,
    private uploadService: UploadService) {
    this.postForm = new FormGroup({
      'tourId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
      'duration': new FormControl(null, [Validators.min(1), Validators.required]),
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
  }

  save() {
    if (this.postForm.valid) {
      this.tour = this.postForm.value;
      this.tour.category = new Category(this.postForm.value.categoryId, '');
      this.tour.image = this.image;

      this.tourService.save(this.tour).subscribe(data => {
        this.toastr.success('Thêm thành công!', 'Hệ thống');
        this.saveFinish.emit('done');
      })

    } else {
      this.toastr.error('Thêm thất bại!', 'Hệ thống');
    }
    this.postForm = new FormGroup({
      'tourId': new FormControl(0),
      'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
      'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
      'duration': new FormControl(null, [Validators.min(1), Validators.required]),
      'price': new FormControl(null, [Validators.required, Validators.min(1000)]),
      'discount': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      'description': new FormControl(null, Validators.required),
      'enteredDate': new FormControl(new Date()),
      'categoryId': new FormControl(1),
      'status': new FormControl(1),
      'sold': new FormControl(0),
    })
    this.image = this.url;
    this.modalService.dismissAll();
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
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
