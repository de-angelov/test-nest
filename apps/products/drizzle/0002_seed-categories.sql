INSERT INTO categories (name, charge) VALUES 
    ('Electronics', 3),
    ('Apparel', 3),
    ('Home & Kitchen', 3),
    ('Grocery', 2),
    ('Furniture', 6),
    ('Sports & Outdoors', 4),
    ('Health & Beauty', 3),
    ('Office Supplies', 4),
    ('Toys & Games', 3)
ON CONFLICT (name) DO NOTHING;