import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/common/Book';
import { BookDetail } from 'src/app/common/BookDetail';
import { BookService } from 'src/app/services/book.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  bookDetails!: BookDetail[];
  book!: Book;
  listData!: MatTableDataSource<BookDetail>;
  bookDetailLength!: number;

  columns: string[] = ['index', 'image', 'tour', 'quantity', 'price'];

  @Output()
  updateFinish: EventEmitter<any> = new EventEmitter<any>();
  @Input() bookId!: number;

  constructor(private modalService: NgbModal, private bookService: BookService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getBook();
    this.getDetail();
  }

  getBook() {
    this.bookService.getById(this.bookId).subscribe(data => {
      this.book = data as Book;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getDetail() {
    this.bookService.getByBook(this.bookId).subscribe(data => {
      this.bookDetails = data as BookDetail[];
      this.listData = new MatTableDataSource(this.bookDetails);
      this.bookDetailLength = this.bookDetails.length;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  open(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }

  confirm() {
    Swal.fire({
      title: 'Bạn muốn xác nhận đặt chỗ này ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.confirm(this.bookId).subscribe(data => {
          this.toastr.success('Xác nhận thành công!', 'Hệ thống');
          this.updateFinish.emit('done');
          this.modalService.dismissAll();
        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

  cancel() {
    Swal.fire({
      title: 'Bạn muốn huỷ đặt chỗ này ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Huỷ',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.cancel(this.bookId).subscribe(data => {
          this.toastr.success('Huỷ thành công!', 'Hệ thống');
          this.updateFinish.emit('done');
          this.modalService.dismissAll();
        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

  thanks() {
    Swal.fire({
      title: 'Bạn muốn xác nhận đặt chỗ này đã thanh toán?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bookService.thanks(this.bookId).subscribe(data => {
          this.toastr.success('Xác nhận thành công!', 'Hệ thống');
          this.updateFinish.emit('done');
          this.modalService.dismissAll();
        }, error => {
          this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
        })
      }
    })
  }

}
