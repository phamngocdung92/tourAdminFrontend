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

interface CalendarDay {
  date: number | null;
  isClosed?: boolean;
}
interface ClosedTourDate {
  statusId: number;
  tourId: number;
  fromDate: string;
  toDate: string;
  status: boolean;
}

@Component({
  selector: 'app-unavailable-tour',
  templateUrl: './unavailable-tour.component.html',
  styleUrls: ['./unavailable-tour.component.css']
})
export class UnavailableTourComponent implements OnInit {
  currentDate: Date = new Date();
  daysInMonth: number[] = [];
  weekDays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  monthName: string = '';
  year: number = 0;
  tour!: Tour;
  tourStatus!: TourStatus;
  closedDates: Date[] = [];

  selectFile!: File;
  url: string = 'LinkImage';
  image: string = this.url;

  postForm: FormGroup;
  categories!: Category[];

  @Input() id!: number;
  @Output()
  editFinish: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private tourService: TourService,
    private toastr: ToastrService,
    private uploadService: UploadService
  ) {
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
    });
  }
  ngOnInit(): void {
    this.getClosedTourDates(); 
    this.generateCalendar(this.currentDate);
    this.getCategories();
    this.getTour();
  }

  generateCalendar(d: Date) {
    this.daysInMonth = this.getDaysInMonth(d.getMonth(), d.getFullYear());
    this.monthName = this.months[d.getMonth()];
    this.year = d.getFullYear();
  }

  getDaysInMonth(month: number, year: number): number[] {
    const days: number = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }

  previousMonth() {
    if (this.currentDate.getMonth() === 0) {
      this.currentDate = new Date(this.currentDate.getFullYear() - 1, 11);
    } else {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1);
    }
    this.generateCalendar(this.currentDate);
  }

  nextMonth() {
    if (this.currentDate.getMonth() === 11) {
      this.currentDate = new Date(this.currentDate.getFullYear() + 1, 0);
    } else {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1);
    }
    this.generateCalendar(this.currentDate);
  }

  getCalendarWeeks(): CalendarDay[][] {
    const weeks: CalendarDay[][] = [];
    const startDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1
    ).getDay();
    const daysInCurrentMonth = this.daysInMonth.length;
  
    let week: CalendarDay[] = Array(startDay).fill({ date: null }); 
  
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const isClosed = this.isDateClosed(day);
      console.log(`Day ${day}: isClosed = ${isClosed}`);
      
      week.push({
        date: day,
        isClosed: isClosed
      });
      
      if (week.length === 7) {
        weeks.push(week);
        week = []; 
      }
    }  
    
    if (week.length > 0) {
      while (week.length < 7) {
        week.push({ date: null });
      }
      weeks.push(week);
    }  
    return weeks;
  }

  isDateClosed(day: number): boolean {
    if (!day) return false;
    
    const checkDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      day
    );

    const result = this.closedDates.some(closedDate => {
      const isClosed = 
        closedDate.getDate() === checkDate.getDate() &&
        closedDate.getMonth() === checkDate.getMonth() &&
        closedDate.getFullYear() === checkDate.getFullYear();
      
      if (isClosed) {
        console.log(`Date ${checkDate.toISOString()} is closed`);
      }
      return isClosed;
    });

    return result;
  }

  // getClosedTourDates() {
  //   if (!this.id) return;
    
  //   this.tourService.getClosedDates(this.id).subscribe({
  //     next: (data: any) => {
  //       this.closedDates = [];

  //     for (const item of data) {
  //       const fromDate = new Date(item.fromDate);
  //       const toDate = new Date(item.toDate);

  //       for (let d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
  //         this.closedDates.push(new Date(d));
  //       }
  //     }

  //       this.generateCalendar(this.currentDate);
  //     },
  //     error: (error) => {
  //       console.error('Error loading closed dates:', error);
  //       this.toastr.error('Error loading closed dates!', 'System');
  //     }
  //   });
  // }

  getClosedTourDates() {
    if (!this.id) return;

    this.tourService.getClosedDates(this.id).subscribe({
      next: (data: any) => {
        this.closedDates = [];

        if (data.length === 0) {
          // No closed dates scenario
          // this.toastr.info('All dates are available for booking.', 'Availability');
          console.log('All dates are available for booking.');
        } else {
          for (const item of data) {
            const fromDate = new Date(item.fromDate);
            const toDate = new Date(item.toDate);

            for (let d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
              this.closedDates.push(new Date(d));
            }
          }
        }

        this.generateCalendar(this.currentDate);
      },
      error: (error) => {
        console.error('Error loading closed dates:', error);
        // this.toastr.error('Error loading closed dates!', 'System');
      }
    });
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
