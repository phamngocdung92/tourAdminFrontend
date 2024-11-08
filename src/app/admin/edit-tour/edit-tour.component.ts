import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/common/Category';
import { Tour } from 'src/app/common/Tour';
import { CategoryService } from 'src/app/services/category.service';
import { TourService } from 'src/app/services/tour.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.component.html',
  styleUrls: ['./edit-tour.component.css']
})
export class EditTourComponent implements OnInit {

  tour!: Tour;

  selectFile!: File;
  url: string = 'LinkImage';
  image: string = this.url;
  
  imageUrls: string[] = [];

  postForm: FormGroup;
  categories!: Category[];

  @Input() id!: number;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(private modalService: NgbModal, private categoryService: CategoryService, private tourService: TourService, private toastr: ToastrService, private uploadService: UploadService) {
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

  update() {
    if (this.postForm.valid) {
      this.tour = this.postForm.value;
      this.tour.category = new Category(this.postForm.value.categoryId, '');
      this.tour.image = this.image;
      var listUrl = this.imageUrls;
      this.tourService.save(this.tour).subscribe(data => {
        this.toastr.success('Cập nhật thành công!', 'Hệ thống');
  
        if (this.tour.tourId !== 0) {
          this.tourService.addImagesToTour(this.tour.tourId, listUrl).subscribe(imageData => {
            this.toastr.success('Images added successfully!', 'System');
            console.log("add image api: ",imageData);
          }, error => {
            this.toastr.error('Error adding images', 'System');
          });
        }
  
        this.editFinish.emit('done');
      }, error => {
        this.toastr.error('Cập nhật thất bại!', 'Hệ thống');
      });
    } else {
      this.toastr.error('Hãy kiểm tra lại dữ liệu!', 'Hệ thống');
    }
  
    // Reset the form after submission
    this.resetForm();
    this.modalService.dismissAll();
  }


  onImageUrlsChange(event: any) {
    // Capture multiple image URLs input (comma-separated)
    const inputElement = event.target as HTMLInputElement;
  const urls = inputElement.value.split(',');  // Assuming user inputs URLs separated by commas
  this.imageUrls = urls.map(url => url.trim());  // Clean up any extra spaces
  console.log("list url: ",this.imageUrls);
  }
  private resetForm() {
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
      'imageUrls': new FormControl([]),  // Reset the image URLs
    })
    this.image = this.url;
    this.imageUrls = [];  // Reset the image URLs list
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
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
