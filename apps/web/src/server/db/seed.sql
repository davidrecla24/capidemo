-- Seed products
INSERT OR IGNORE INTO products (id, slug, name, description, active) VALUES
  ('prod_001', 'adlai-grain', 'Adlai Grain', 'Premium Philippine adlai grain, carefully sourced and cleaned.', 1);

-- Seed SKUs: 1kg, 3kg, 9kg, 27kg
INSERT OR IGNORE INTO skus (id, product_id, code, label, weight_kg, price_minor, currency, active) VALUES
  ('sku_1kg',  'prod_001', 'ADLAI-1KG',  '1 kg',  1,  29900, 'PHP', 1),
  ('sku_3kg',  'prod_001', 'ADLAI-3KG',  '3 kg',  3,  79900, 'PHP', 1),
  ('sku_9kg',  'prod_001', 'ADLAI-9KG',  '9 kg',  9, 219900, 'PHP', 1),
  ('sku_27kg', 'prod_001', 'ADLAI-27KG', '27 kg', 27, 599900, 'PHP', 1);

-- Seed inventory lots
INSERT OR IGNORE INTO inventory_lots (id, sku_id, quantity_on_hand, quantity_reserved, reorder_threshold) VALUES
  ('lot_1kg',  'sku_1kg',  100, 0, 20),
  ('lot_3kg',  'sku_3kg',  50,  0, 10),
  ('lot_9kg',  'sku_9kg',  30,  0, 5),
  ('lot_27kg', 'sku_27kg', 15,  0, 3);
