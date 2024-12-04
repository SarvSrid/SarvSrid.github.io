-- Users Table
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type TEXT CHECK (user_type IN ('admin', 'shopper')) NOT NULL
);

-- Categories Table
CREATE TABLE Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    priority_level INTEGER DEFAULT 0
);

-- Products Table
CREATE TABLE Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    price REAL NOT NULL,
    category_id INTEGER,
    is_featured INTEGER DEFAULT 0 CHECK (is_featured IN (0, 1)),
    FOREIGN KEY (category_id) REFERENCES Categories(id)
);

-- Carts Table
CREATE TABLE Carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT CHECK (status IN ('new', 'abandoned', 'purchased')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- CartProducts Table
CREATE TABLE CartProducts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER CHECK (quantity > 0) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES Carts(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Newly Added Tables
-- Orders Table
CREATE TABLE Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL,
    order_date DATETIME NOT NULL,
    total_amount REAL NOT NULL,
    status TEXT CHECK (status IN ('processing', 'shipped', 'delivered', 'canceled')) NOT NULL,
    customer_id INTEGER NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES Carts(id),
    FOREIGN KEY (customer_id) REFERENCES Users(id)
);

-- OrderProducts Table
CREATE TABLE OrderProducts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price_per_unit REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);