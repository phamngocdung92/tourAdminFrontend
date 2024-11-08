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

  imageUrls: string[] = [];

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



  //for url (not use it anymore)
//   save() {
//     if (this.postForm.valid) {
//         this.tour = this.postForm.value;
//         this.tour.category = new Category(this.postForm.value.categoryId, '');

//         // Check if tour is new or existing
//         if (this.tour.tourId === 0) {
//             this.tour.tourId = 0;  // Set to null or undefined for new tours
//         }

//         // Add image URLs to the tour object (this.imageUrls should be an array)
//         this.tour.imageUrls = this.imageUrls;

//         // Save the tour (and handle images in the backend)
//         this.tourService.save(this.tour).subscribe(data => {
//             this.toastr.success('Thêm thành công!', 'Hệ thống');

//             // If it's a new tour, you might also need to add the images separately if needed
//             if (this.tour.tourId !== null) {
//                 // Make an API call to add images after tour is created (if required)
//                 this.tourService.addImagesToTour(this.tour.tourId, this.imageUrls).subscribe(imageData => {
//                     this.toastr.success('Images added successfully!', 'System');
//                 }, error => {
//                     this.toastr.error('Error adding images', 'System');
//                 });
//             }

//             this.saveFinish.emit('done');
//         });

//     } else {
//         this.toastr.error('Thêm thất bại!', 'Hệ thống');
//     }

//     // Reset the form after submission
//     this.resetForm();
//     this.modalService.dismissAll();
// }
  // onImageUrlsChange(event: any) {
  //   // Capture multiple image URLs input (comma-separated)
  //   const inputElement = event.target as HTMLInputElement;
  // const urls = inputElement.value.split(',');  // Assuming user inputs URLs separated by commas
  // this.imageUrls = urls.map(url => url.trim());  // Clean up any extra spaces
  // console.log("list url: ",this.imageUrls);
  // }
  // private resetForm() {
  //   this.postForm = new FormGroup({
  //     'tourId': new FormControl(0),
  //     'name': new FormControl(null, [Validators.minLength(4), Validators.required]),
  //     'quantity': new FormControl(null, [Validators.min(1), Validators.required]),
  //     'duration': new FormControl(null, [Validators.min(1), Validators.required]),
  //     'price': new FormControl(null, [Validators.required, Validators.min(1000)]),
  //     'discount': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
  //     'description': new FormControl(null, Validators.required),
  //     'enteredDate': new FormControl(new Date()),
  //     'categoryId': new FormControl(1),
  //     'status': new FormControl(1),
  //     'sold': new FormControl(0),
  //     'imageUrls': new FormControl([]),  // Reset the image URLs
  //   })
  //   this.image = this.url;
  //   this.imageUrls = [];  // Reset the image URLs list
  // }

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
