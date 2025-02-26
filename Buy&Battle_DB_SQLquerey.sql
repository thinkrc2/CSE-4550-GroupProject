USE [Buy&Battle_DB];
GO

-- Create table that contains user information.
CREATE TABLE Users (
	UserID INT PRIMARY KEY IDENTITY(1,1), -- Will increment upwards starting from 1, but starting point or size of steps per increment can be changed.
	Username NVARCHAR(50) UNIQUE NOT NULL,
	Email NVARCHAR(100) UNIQUE NOT NULL,
	PasswordHash NVARCHAR(255) NOT NULL, -- Hashed password for better protection. Must code in diff language to ensure security. 
	JoinDate DATETIME DEFAULT GETDATE(), -- Grabs immediate addition time from system.
	UserType VARCHAR(20) CHECK (UserType IN ('Buyer', 'Seller', 'Admin')), -- Allows for simple addition of user roles allowing for permission changes.
	Rating DECIMAL(3,2) DEFAULT 5.0 -- Allows user ratings of 3 total digits and 2 decimal places such as 1.25 or 5.00.
);

-- Create table that contains card information. 
CREATE TABLE Cards (
	CardID INT PRIMARY KEY IDENTITY (1,1),
	Name NVARCHAR(100) NOT NULL,
	SetName NVARCHAR(100), -- In case we decide to expand our card set list. 
	Rarity NVARCHAR(50), -- Rarity of card. Can be objective. Admins may have to moderate. 
	Condition NVARCHAR(20) CHECK (Condition IN ('Mint", "Near Mint', 'Good', 'Fair', 'Poor')),
	Year INT, -- Year of card's publication.
	Game NVARCHAR(50) CHECK (Game IN ('Magic: The Gathering')), -- In case we potentially decide to add different games in the future.
	CardImageURL NVARCHAR(255) -- To keep a URL to the image of the card in case of detail mismatch.
);

-- Create table that contains listed items to be sold along with their information.
CREATE TABLE Listings (
	ListingID INT PRIMARY KEY IDENTITY(1,1),
	SellerID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE, -- Refers to Users table and matches UserID to existing UserID to set as "SellerID". Deletes Seller records if Seller's UserID is deleted from DB to prevent orphaned records.
	CardID INT FOREIGN KEY REFERENCES Cards(CardID) ON DELETE CASCADE, -- Refers to Cards table and matches CardID to existing CardID. Deletes card records if CardID is deleted from DB to prevent orphaned records. 
    Price DECIMAL(10,2) NOT NULL, -- 10 possible digits for price with 2 decimal places. i.e. 99999999.99.
    Quantity INT CHECK (Quantity > 0), -- Ensures quantity of items sold never go below 1. 
    Status NVARCHAR(20) CHECK (Status IN ('Active', 'Sold', 'Cancelled')) DEFAULT 'Active', -- Sets status of listing as Active and allows for change based on listing's status.
    CreatedAt DATETIME DEFAULT GETDATE() -- Captures system time of when listing was created.
);

-- Create table that contains order information and status. 
CREATE TABLE Orders (
	OrderID INT PRIMARY KEY IDENTITY(1,1),
	BuyerID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE SET NULL, -- Refers to Users table and matches UserID to existing UserID. Keeps UserID in table under BuyerID. If BuyerID is deleted, sets BuyerID to Null.
	TotalAmount DECIMAL(10,2) NOT NULL,
	OrderDate DATETIME DEFAULT GETDATE(),
	Status NVARCHAR(20) CHECK (Status IN ('Pending', 'Shipped', 'Delivered', 'Cancelled')) DEFAULT 'Pending' -- Sets shipping status to Pending and can be changed based on status changes. 
);

CREATE TABLE OrderDetails (
	OrderDetailID INT PRIMARY KEY IDENTITY(1,1),
	OrderID INT FOREIGN KEY REFERENCES Orders(OrderID) ON DELETE CASCADE, -- Matches OrderID to existing OrderID. Delete all records if OrderID is deleted.
	ListingID INT FOREIGN KEY REFERENCES Listings(ListingID) ON DELETE SET NULL, -- Matches ListingID to existing ListingID. Sets ListingID to NULL if ListingID is deleted.
	Quantity INT CHECK (Quantity > 0),
	PriceAtPurchase DECIMAL(10,2) NOT NULL
);

-- Create table that contains transaction details.
CREATE TABLE Transactions (
	TransactionID INT PRIMARY KEY IDENTITY(1,1),
	OrderId INT FOREIGN KEY REFERENCES Orders(OrderID) ON DELETE CASCADE, -- Matches OrderID to existing OrderID. If OrderID is deleted, records of the order will be deleted as well to prevent orphaned records.
	PaymentMethod NVARCHAR(50) CHECK (PaymentMethod IN ('Credit Card', 'PayPal')), -- Can add different payment methods if necessary.
	PaymentStatus NVARCHAR(20) CHECK (PaymentStatus IN ('Pending', 'Completed', 'Failed')) DEFAULT 'Pending', -- Sets order status to Pending and can be changed based on status changes. 
	TransactionDate DATETIME DEFAULT GETDATE()
);

-- Create table that contains review information. Optional portion but is good to have the code for if we decide to add a portion for reviews. 
CREATE TABLE Reviews (
	ReviewID INT PRIMARY KEY IDENTITY(1,1),
	ReviewerID INT FOREIGN KEY REFERENCES Users(UserID), -- Matches UserID to existing UserID and keeps it as "ReviewerID".
	SellerID INT FOREIGN KEY REFERENCES Users(UserID), -- Matches UserID to existing UserID and keeps it as "SellerID".
	Rating INT CHECK (Rating BETWEEN 1 AND 5), -- Allows for a rating between 1 and 5. 
	Comment NVARCHAR(500),
	ReviewDate DATETIME DEFAULT GETDATE(),
	CHECK (ReviewerID <> SellerID) -- Ensures the reviewer and the seller are not the same user.
);