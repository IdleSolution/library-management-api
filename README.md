# Library management API
A node.js API that makes managing a library easier.

## Technologies
* Node.js
* Express
* Typescript
* MongoDB

## TODO list
* Add authentication so the routes can only be accessed by a librarian
* Add unit tests

## Currently supported routes

* `POST /api/author/new` </br>
Adds a new author </br>
Parameters: `firstName`, `lastName`

* `POST /api/bookBorrow` </br>
Borrows book to a reader </br>
Parameters: `bookPrintId`, `borrowerId`, `dueDate`

* `DELETE /api/bookBorrow` </br>
Returns book to the library </br>
Parameters: `readerId`, `bookPrintId`

* `POST /api/book/new` </br>
Adds a new book </br>
Parameters: `title`, `isbn`, `authorsId` (array), `genres` (array)

* `GET /api/book/author` </br>
Returns a list of books written by a given author </br>
Parameters: `authorId`

* `GET /api/book/genre` </br>
Returns a list of books with corresponding genre </br>
Parameters: `genre`

* `POST /api/bookPrint/new` </br>
Adds a new book print </br>
Parameters:  `bookId`, `quality` (optional), `language` 


* `GET /api/bookPrint/available` </br>
Returns a list of all available prints of a given book </br>
Parameters:  `bookId` 

* `POST /api/reader/new` </br>
Adds a new reader </br>
Parameters:  `firstName`, `lastName`, `birthday`, `pesel`, `email`, `phone`

* `GET /api/reader/borrowed` </br>
Returns a list of all borrowed books of a given reader </br>
Parameters:  `readerId` 
</br></br>

All dates have to be in ("YYYY-DD-MM") format, and all arrays need to be passed like this: ["element1", "element2"]



## Setup
Install:

        npm install
        
Run the server:

        npm run start

