import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { Book } from 'src/app/common/Book';
import { BookService } from 'src/app/services/book.service';
import { PageService } from 'src/app/services/page.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  listData!: MatTableDataSource<Book>;
  books!: Book[];
  bookLength!: number;
  columns: string[] = ['id', 'user', 'address', 'phone', 'amount', 'bookDate', 'status', 'view'];

  
  webSocket!: WebSocket;
  chatMessages: ChatMessage[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pageService: PageService, private toastr: ToastrService, private bookService: BookService, private route: ActivatedRoute) { 
    route.params.subscribe(val => {
      this.ngOnInit();
    })
  }

  ngOnInit(): void {
    this.openWebSocket();
    this.pageService.setPageActive('book');
    this.getAllBook();
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  getAllBook() {
    this.bookService.get().subscribe(data => {
      this.books = data as Book[];
      this.listData = new MatTableDataSource(this.books);
      this.bookLength = this.books.length;
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  search(event: any) {
    const fValue = (event.target as HTMLInputElement).value;
    this.bookService.get().subscribe(data => {
      this.books = data as Book[];
      this.books = this.books.filter(o => o.user.name.toLowerCase().includes(fValue.toLowerCase()) || o.bookId===Number(fValue) || o.address.toLowerCase().includes(fValue.toLowerCase()) || o.phone.includes(fValue.toLowerCase()));
      this.listData = new MatTableDataSource(this.books);
      this.bookLength = this.books.length;
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    })
    
  }

  finish() {
    this.ngOnInit();
  }

  openWebSocket() {
    this.webSocket = new WebSocket('ws://localhost:8080/notification');

    this.webSocket.onopen = (event) => {
      // console.log('Open: ', event);
    };

    this.webSocket.onmessage = (event) => {
      this.getAllBook();
    };

    this.webSocket.onclose = (event) => {
      // console.log('Close: ', event);
    };
  }

  closeWebSocket() {
    this.webSocket.close();
  }

}
