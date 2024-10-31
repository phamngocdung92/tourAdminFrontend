import { Book } from "./Book";
import { Tour } from "./Tour";

export class BookDetail {
    'bookDetailId':number;
    'quantity':number;
    'price':number;
    'tour':Tour;
    'book':Book;
    'startDate':Date;
    'endDate':Date;
}
