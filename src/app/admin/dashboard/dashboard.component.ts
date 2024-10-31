import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { ChatMessage } from 'src/app/common/ChatMessage';
import { Customer } from 'src/app/common/Customer';
import { Book } from 'src/app/common/Book';
import { Statistical } from 'src/app/common/Statistical';
import { CustomerService } from 'src/app/services/customer.service';
import { BookService } from 'src/app/services/book.service';
import { PageService } from 'src/app/services/page.service';
import { StatisticalService } from 'src/app/services/statistical.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  bookHandle!: number;
  customerLength!: number;
  books!: Book[];
  customers!: Customer[];

  statistical!: Statistical[];
  labels: string[] = [];
  data: number[] = [];
  year: number = 2021;
  myChartBar !: Chart;
  countYears!: number[];

  revenueYearNow!: number;
  revenueMonthNow!: number;
  
  webSocket!: WebSocket;
  chatMessages: ChatMessage[] = [];

  constructor(private pageService: PageService, private toastr: ToastrService, private bookService: BookService, private customerService: CustomerService, private statisticalService: StatisticalService) { }

  ngOnInit(): void {
    this.openWebSocket();
    this.pageService.setPageActive('dashboard');
    this.getAllBook();
    this.getAllCustomer();
    this.getStatisticalYear();
    this.getCountYear();
    Chart.register(...registerables);
  }

  ngOnDestroy(): void {
    this.closeWebSocket();
  }

  getStatisticalYear() {
    this.statisticalService.getByMothOfYear(this.year).subscribe(data => {
      this.statistical = data as Statistical[];
      this.statistical.forEach(item => {
        this.labels.push('Tháng ' + item.month);
        this.data.push(item.amount);
      })
      this.loadChartBar();
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getCountYear() {
    this.statisticalService.getCountYear().subscribe(data => {
      this.countYears = data as number[];
    }, error => {
      this.toastr.error('Lỗi! ' + error.status, 'Hệ thống');
    })
  }

  getRevenueYear(year: number): number {
    let revenue = 0
    for (let i = 0; i < this.books.length; i++) {
      if (new Date(this.books[i].bookDate).getFullYear() == year && this.books[i].status == 2) {
        revenue += this.books[i].amount;
      }
    }
    return revenue;
  }

  getRevenueYearNow(): number {
    let revenue = 0
    for (let i = 0; i < this.books.length; i++) {
      if (new Date(this.books[i].bookDate).getFullYear() == new Date().getFullYear() && this.books[i].status == 2) {
        revenue += this.books[i].amount;
      }
    }
    return revenue;
  }

  getRevenueMonthNow(): number {
    let revenue = 0
    for (let i = 0; i < this.books.length; i++) {
      if (new Date(this.books[i].bookDate).getMonth() == new Date().getMonth() && new Date(this.books[i].bookDate).getFullYear() == new Date().getFullYear() && this.books[i].status == 2) {
        revenue += this.books[i].amount;
      }
    }
    return revenue;
  }

  getAllBook() {
    this.bookService.get().subscribe(data => {
      this.books = data as Book[];
      this.bookHandle = 0;
      for (let i = 0; i < this.books.length; i++) {
        if (this.books[i].status == 0) {
          this.bookHandle++;
        }
      }
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  getAllCustomer() {
    this.customerService.getAll().subscribe(data => {
      this.customers = data as Customer[];
      this.customerLength = this.customers.length;
    }, error => {
      this.toastr.error('Lỗi server', 'Hệ thống');
    })
  }

  setYear(year: number) {
    this.year = year;
    this.labels = [];
    this.data = [];
    this.myChartBar.destroy();
    this.ngOnInit();
  }

  loadChartBar() {
    this.myChartBar = new Chart('chart', {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          // label: '# of Votes',
          data: this.data,
          // borderColor: 'rgb(75, 192, 192)',
          // pointBorderColor: 'rgba(54, 162, 235, 0.2)',
          // backgroundColor: 'rgba(255, 99, 132, 0.2)',
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(0, 162, 71, 0.2)',
            'rgba(82, 0, 36, 0.2)',
            'rgba(82, 164, 36, 0.2)',
            'rgba(255, 158, 146, 0.2)',
            'rgba(123, 39, 56, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(201, 203, 207, 1)',
            'rgba(0, 162, 71, 1)',
            'rgba(82, 0, 36, 1)',
            'rgba(82, 164, 36, 1)',
            'rgba(255, 158, 146, 1)',
            'rgba(123, 39, 56, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
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
