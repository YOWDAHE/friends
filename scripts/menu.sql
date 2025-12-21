-- HAPPY HOUR SECTIONS
WITH hh_cat AS (
  SELECT id AS category_id FROM menu_categories WHERE slug = 'happy-hour'
)
INSERT INTO menu_sections (category_id, slug, name, image_url, image_position, sort_order, is_active)
SELECT category_id, slug, name, image_url, image_position, sort_order, true
FROM hh_cat
CROSS JOIN (
  VALUES
    ('happy-hour-bites',  'Happy Hour Bites',  '/images/menu/happy_hour_bites.png',  'left',  0),
    ('happy-hour-drinks', 'Happy Hour Drinks', '/images/menu/happy_hour_drinks.png', 'right', 1)
) AS v(slug, name, image_url, image_position, sort_order);

-- HAPPY HOUR ITEMS
WITH hh_bites AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'happy-hour-bites'
),
hh_drinks AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'happy-hour-drinks'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
-- Bites
SELECT section_id, name, price, description, true, sort_order, false
FROM hh_bites
CROSS JOIN (
  VALUES
    ('Slider (1)*',                  2.99, NULL,  0),
    ('Quesadilla (1 piece)',         2.99, NULL,  1),
    ('Fries',                        3.99, NULL,  2),
    ('Truffle Fries',                4.99, NULL,  3),
    ('Veggies Spring Rolls (3)',     6.99, NULL,  4),
    ('Mozzarella Sticks (4)',        7.99, NULL,  5),
    ('Cheesesteak Egg Rolls (2)',    7.99, NULL,  6),
    ('Wings (4)',                    4.99, NULL,  7),
    ('Bang Bang Shrimp (4)*',        8.99, NULL,  8),
    ('Vegan Burger',                 9.99, NULL,  9),
    ('Nachos',                       9.99,
       'Topped with seasoned ground beef, warm queso sauce, and fresh pico de gallo. (Served as is—no modifications).',
       10)
) AS v(name, price, description, sort_order)

UNION ALL

-- Drinks
SELECT section_id, name, price, description, true, sort_order, false
FROM hh_drinks
CROSS JOIN (
  VALUES
    ('Beers',             4.99, NULL, 0),
    ('White/Red Wine',    6.99, NULL, 1),
    ('Well Shots',        7.99, NULL, 2),
    ('Premium Shots',     9.99, NULL, 3),
    ('Friends Cocktails', 9.99, NULL, 4)
) AS v(name, price, description, sort_order);

-- APPETIZERS SECTION
WITH app_cat AS (
  SELECT id AS category_id FROM menu_categories WHERE slug = 'appetizers'
)
INSERT INTO menu_sections (category_id, slug, name, image_url, image_position, sort_order, is_active)
SELECT category_id, 'appetizers-main', 'Appetizers', '/images/menu/appetizers.png', 'left', 0, true
FROM app_cat;

-- APPETIZERS ITEMS
WITH app_sec AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'appetizers-main'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM app_sec
CROSS JOIN (
  VALUES
    ('French Fries',                    7.99, NULL,  0),
    ('Truffle Fries',                  10.99, NULL,  1),
    ('Chicken Tenders',                15.99,
       'Crispy chicken marinated in buttermilk, then fried golden brown. Served with a side of French fries and honey mustard.',
       2),
    ('Philly Cheesesteak Egg Rolls*',  12.99,
       'Three (3) egg rolls filled with Philly Cheesesteak. Served with chili sauce.',
       3),
    ('Veggie Spring Rolls',            11.99,
       'Five (5) spring rolls filled with vegetables, rolled, and fried.',
       4),
    ('Crab Cake*',                     13.99,
       'Five (5) pieces of deep-fried crab balls drizzled with chipotle sauce.',
       5),
    ('Wings',                          16.99,
       '(6) wings tossed in your choice of sauce: Sweet Chili, Buffalo, Old Bay, Honey Old Bay or Lemon Garlic. Choose Ranch or Blue Cheese. Served with a side of fries.',
       6),
    ('Vegan Cauliflower',              15.99,
       'A little spicy, immensely flavorful, and incredibly delicious. Crispy on the outside, tender in the middle. Served with a side of fries.',
       7),
    ('Mozzarella Sticks (6)',          12.99, NULL, 8),
    ('Spicy Bang Bang Chicken Tenders',15.99,
       'Tossed in our sweet spicy chili sauce. Served with fries.',
       9),
    ('Southwest Chicken Egg Rolls',    12.99, NULL, 10),
    ('Spicy Bang Bang Shrimp*',        16.99,
       '(5) crunchy tempura shrimp tossed in our spicy sweet chili sauce.',
       11),
    ('Caesar Salad*',                   9.99,
       'Classic Caesar salad with your choice of protein. Chicken: $16.99, Shrimp: $18.99, Salmon: $21.99.',
       12),
    ('Mountain Wings Platter',         38.99,
       '18 wings with your choice of Sweet Chili, Buffalo, Lemon Garlic Parmesan, or chipotle sauce.',
       13),
    ('Nachos',                         12.99,
       'Topped with seasoned ground beef, warm queso sauce, and fresh pico de gallo. (Served as is—no modifications).',
       14),
    ('Spinach Artichoke Dip',          12.99,
       'A creamy blend of sautéed spinach, tender artichoke hearts, and melted cheeses, served warm with crispy tortilla chips.',
       15)
) AS v(name, price, description, sort_order);

-- ENTREES SECTION
WITH ent_cat AS (
  SELECT id AS category_id FROM menu_categories WHERE slug = 'entrees'
)
INSERT INTO menu_sections (category_id, slug, name, image_url, image_position, sort_order, is_active)
SELECT category_id, 'entrees-main', 'Entrees', '/images/menu/entries.png', 'right', 0, true
FROM ent_cat;

-- ENTREES ITEMS
WITH ent_sec AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'entrees-main'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM ent_sec
CROSS JOIN (
  VALUES
    ('Tibs*',             17.99,
      'Stir-fry steak, tomato, lettuce, onion, green pepper, Ethiopian butter, NebFoto sauce on a bed of your choice of basmati rice or penne pasta.',
      0),
    ('Grilled Shrimp*',   24.99,
      'Grilled shrimp with sautéed bell pepper, onion, cherry tomato, and broccoli. Choose a side: rice or mashed potatoes.',
      1),
    ('Grilled Chicken Breast', 21.99,
      'Grilled chicken with sautéed bell pepper, onion, cherry tomato, and broccoli. Choose a side: rice or mashed potatoes.',
      2),
    ('Friends Salmon*',   26.99,
      'Grilled salmon with sautéed bell pepper, onion, cherry tomato, and broccoli. Choose a side: rice or mashed potatoes.',
      3),
    ('Glazed Salmon*',    26.99,
      'Glazed salmon with sautéed bell pepper, onion, cherry tomato, and broccoli. Choose a side: rice or mashed potatoes.',
      4),
    ('Fajitas',           13.99,
      'A sizzling medley of red peppers, red onions, and cherry tomatoes, served with rice. Shrimp – $17.99*, Beef – $16.99*, Chicken – $15.99, Veggie – $13.99.',
      5),
    ('Lamb Chops*',       32.00,
      'Lamb chops with sautéed bell pepper, onion, cherry tomato, and broccoli. Choose a side: rice or mashed potatoes.',
      6),
    ('Rib Eye Steak*',    29.99,
      'Generous 16 oz. cut, thick and juicy with sautéed bell pepper, onion, cherry tomato, and broccoli. Choice of rice, mashed potatoes, or french fries.',
      7),
    ('Friends Pasta',     15.99,
      'Penne with Alfredo, tomato, or pink sauce. Comes with garlic bread. Beef: $19.99*, Chicken: $22.99, Shrimp: $25.99*, Lamb Chops: $31.98*, Salmon: $29.99*.',
      8),
    ('Friends Stir Fry',  15.99,
      'Eggs, bell peppers, broccoli, and onion with your choice of protein mixed with basmati curry rice. Veggie: $15.99, Chicken: $17.99, Tibs: $19.99*, Shrimp: $21.99*.',
      9)
) AS v(name, price, description, sort_order);


-- SANDWICHES SECTION
WITH sand_cat AS (
  SELECT id AS category_id FROM menu_categories WHERE slug = 'sandwiches'
)
INSERT INTO menu_sections (category_id, slug, name, image_url, image_position, sort_order, is_active)
SELECT category_id, 'sandwiches-main', 'Sandwiches', '/images/menu/appetizers.png', 'left', 0, true
FROM sand_cat;

-- SANDWICHES ITEMS
WITH sand_sec AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'sandwiches-main'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM sand_sec
CROSS JOIN (
  VALUES
    ('Shawarma', 14.99,
      'Your choice of beef or chicken wrapped in a tortilla with tomato, lettuce, onion, and tahini sauce. Served with a side of French fries.',
      0),
    ('Friends Burger*', 17.99,
      'Tender and juicy beef with American cheese, smothered with spicy chipotle sauce. Served with a side of French fries and a pickle.',
      1),
    ('Vegan Burger', 18.99,
      'Plant-based burger with American cheese, homemade vegan sauce, tomato, and lettuce. Served with a side of French fries and a pickle.',
      2),
    ('@NebFoto''s Tibs Panini', 17.50,
      'Stir-fry, tomato, lettuce, onion, green pepper, Ethiopian butter, cheddar cheese and NebFoto sauce on ciabatta bread. Served with a side of French fries. Chicken or Beef*: $17.50, Crab Cake: $19.99*, Shrimp: $21.99*.',
      3)
) AS v(name, price, description, sort_order);


-- VEGAN SECTION
WITH veg_cat AS (
  SELECT id AS category_id FROM menu_categories WHERE slug = 'vegan'
)
INSERT INTO menu_sections (category_id, slug, name, image_url, image_position, sort_order, is_active)
SELECT category_id, 'vegan-main', 'Vegan', '/images/menu/appetizers.png', 'right', 0, true
FROM veg_cat;

-- VEGAN ITEMS
WITH veg_sec AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'vegan-main'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM veg_sec
CROSS JOIN (
  VALUES
    ('Pasta', 15.99,
      'Penne pasta with marinara sauce. Add vegan meatballs for $5.00.',
      0),
    ('Vegan Cauliflower', 13.99,
      'A little spicy, immensely flavorful, and incredibly delicious.',
      1),
    ('Veggie Spring Rolls', 11.99,
      'Five (5) spring rolls filled with vegetables, rolled and fried.',
      2)
) AS v(name, price, description, sort_order);


-- DESSERT SECTION
WITH des_cat AS (
  SELECT id AS category_id FROM menu_categories WHERE slug = 'dessert'
)
INSERT INTO menu_sections (category_id, slug, name, image_url, image_position, sort_order, is_active)
SELECT category_id, 'dessert-main', 'Dessert', '/images/menu/appetizers.png', 'left', 0, true
FROM des_cat;

-- DESSERT ITEMS
WITH des_sec AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'dessert-main'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM des_sec
CROSS JOIN (
  VALUES
    ('Coffee Cake',         8.99, NULL, 0),
    ('Hot & Cold Romance', 12.99, NULL, 1),
    ('Golden Sticks',      10.99, NULL, 2)
) AS v(name, price, description, sort_order);


-- COCKTAILS SECTIONS
WITH cock_cat AS (
  SELECT id AS category_id FROM menu_categories WHERE slug = 'cocktails'
)
INSERT INTO menu_sections (category_id, slug, name, image_url, image_position, sort_order, is_active)
SELECT category_id, slug, name, image_url, image_position, sort_order, true
FROM cock_cat
CROSS JOIN (
  VALUES
    ('signature-cocktails', 'Cocktails',            '/images/menu/happy_hour_drinks.png', 'left',  0),
    ('specialty-cocktails', 'Speciality Cocktails', '/images/menu/happy_hour_drinks.png', 'right', 1),
    ('shooters',            'Shooters',             '/images/menu/happy_hour_drinks.png', 'left',  2)
) AS v(slug, name, image_url, image_position, sort_order);

-- SIGNATURE COCKTAILS ITEMS
WITH sig_sec AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'signature-cocktails'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM sig_sec
CROSS JOIN (
  VALUES
    ('Snowflake Margarita',     12.99, 'Tequila, triple sec, coconut cream, lime juice.', 0),
    ('Winter Wonderland',       12.99, 'Rum, strawberry purée, lemon juice, grenadine.', 1),
    ('Friends with Benefits',   15.99, 'Vodka and passionfruit liqueur shaken with pineapple, strawberry, and simple syrup, topped with champagne.', 2),
    ('Close Friends',           15.99, 'Strawberry-passion fruit tequila lemon drop with added sparkle.', 3),
    ('Friends Old Fashioned',   15.99, 'House bourbon or rye whiskey, simple syrup, Angostura bitters, large ice cube, orange peel garnish.', 4),
    ('Friends Margarita',       15.99, 'House tequila, lime juice, triple sec, salt or sugar rim, lime wedge.', 5),
    ('Friends Mojito',          15.99, 'House white rum, lime juice, simple syrup, mint, club soda.', 6),
    ('Friends Cosmopolitan',    15.99, 'House vodka, triple sec, lime juice, cranberry juice.', 7),
    ('Friends Whiskey Sour',    15.99, 'House bourbon, lemon juice, simple syrup, lemon wheel and cherry garnish.', 8),
    ('Friends Daiquiri',        15.99, 'House white rum, lime juice, simple syrup.', 9),
    ('Friends Piña Colada',     15.99, 'House white rum, coconut cream, pineapple juice.', 10),
    ('Friends Espresso Martini',15.99, 'House vodka, freshly brewed espresso, coffee liqueur, simple syrup, coffee beans garnish.', 11),
    ('Lover & Friends',         15.99, 'Gin, lavender syrup, lemon, triple sec, served over a flower ice sphere.', 12),
    ('Malibu Bay Breeze',       15.99, 'Malibu coconut rum with pineapple juice and cranberry juice.', 13),
    ('Pornstar Martini',        15.99, 'Vanilla vodka, passionfruit purée, hint of lime, served with a shot of prosecco.', 14),
    ('Situationship',           15.99, 'Hennessy, Cointreau, lime juice, strawberry purée, served neat.', 15),
    ('Left on Read',            15.99, 'Tequila or vodka, white peach purée, ginger-honey syrup, lime juice.', 16),
    ('No Strings',              15.99, 'Bourbon, lemon juice, simple syrup, blackberry purée, topped with club soda.', 17),
    ('Just A Friend',           15.99, 'Mezcal or tequila, guava purée, lime juice, triple sec, sugar and Tajín rim.', 18),
    ('U UP?',                   15.99, 'Vanilla vodka, Kahlúa, crème de cacao, fresh espresso, simple syrup, chocolate bitters.', 19),
    ('Swipe Right',             15.99, 'Vodka, passionfruit purée, lychee syrup, lime juice.', 20),
    ('Summer Fling',            15.99, 'Vodka, coconut cream, lemon juice, piña mix, pineapple juice, simple syrup.', 21),
    ('Wild Thoughts',           15.99, 'Vodka or tequila, wildberry purée, rose syrup, lime juice, simple syrup.', 22),
    ('Negroni',                 15.99, 'Gin, Campari, sweet vermouth, orange peel garnish.', 23),
    ('Amaretto Sour',           15.99, 'Disaronno, sour mix, Fee Foam, cherry and orange wheel garnish.', 24),
    ('Mule',                    15.99, 'Classic mule with flavor options: strawberry, mango, peach, blackberry, guava, passionfruit, lavender, wild berry, rose, and more.', 25),
    ('Piña-Colada',             15.99, 'Rum, piña mix, pineapple juice, pineapple and cherry garnish.', 26),
    ('Cosmopolitan',            15.99, 'Vodka, triple sec, cranberry juice, lime.', 27)
) AS v(name, price, description, sort_order);

-- SPECIALITY COCKTAILS ITEMS
WITH spec_sec AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'specialty-cocktails'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM spec_sec
CROSS JOIN (
  VALUES
    ('Smoked Old Fashioned – Signature Presentation', 18.99,
      'Elevated Old Fashioned with house bourbon or rye whiskey, simple syrup, Angostura bitters, large ice cube, orange peel garnish.',
      0),
    ('Sneaky Link', 18.99,
      'Friends version of a rum punch with blends of rum, amaretto, strawberry, pineapple, orange and grenadine.',
      1),
    ('Side Piece',  18.99,
      'Friends version of a Hennessy Sidecar with Cointreau and lemon juice.',
      2)
) AS v(name, price, description, sort_order);

-- SHOOTERS ITEMS
WITH shoot_sec AS (
  SELECT id AS section_id
  FROM menu_sections
  WHERE slug = 'shooters'
)
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM shoot_sec
CROSS JOIN (
  VALUES
    ('Lemon Drop',        12.99, 'Vodka, lemon juice, simple syrup.', 0),
    ('Green Tea',         12.99, 'Whiskey, peach schnapps, sour mix.', 1),
    ('Mexican Tea',       12.99, 'Tequila, peach schnapps, sour mix.', 2),
    ('White Tea',         12.99, 'Vodka, peach schnapps, sour mix.', 3),
    ('Pink Starburst',    12.99, 'Vodka, watermelon pucker, sour mix.', 4),
    ('Blue Gummy Bear',   12.99, 'Vodka, blue curaçao, sour mix, topped with Sprite.', 5)
) AS v(name, price, description, sort_order);


-- CAFE SECTIONS
WITH cafe_cat AS (
  SELECT id AS category_id FROM menu_categories WHERE slug = 'cafe'
)
INSERT INTO menu_sections (category_id, slug, name, image_url, image_position, sort_order, is_active)
SELECT category_id, slug, name, image_url, image_position, sort_order, true
FROM cafe_cat
CROSS JOIN (
  VALUES
    ('beer',        'Beer',              '/images/menu/happy_hour_bites.png', 'left',  0),
    ('white-wine',  'White Wine',        '/images/menu/happy_hour_bites.png', 'right', 1),
    ('red-wine',    'Red Wines',         '/images/menu/happy_hour_bites.png', 'left',  2),
    ('rose-wine',   'Rosé Wine',         '/images/menu/happy_hour_bites.png', 'right', 3),
    ('champagne',   'Champagne',         '/images/menu/happy_hour_bites.png', 'left',  4),
    ('mocktails',   'Mocktails',         '/images/menu/happy_hour_bites.png', 'right', 5),
    ('breakfast',   'Breakfast 10:00am–2pm', '/images/menu/appetizers.png',  'left',  6),
    ('hot-drinks',  'Hot Drinks',        '/images/menu/appetizers.png', 'right', 7),
    ('cold-drinks', 'Cold Drinks',       '/images/menu/appetizers.png', 'left',  8),
    ('hookah',      'Hookah',            '/images/menu/appetizers.png', 'right', 9)
) AS v(slug, name, image_url, image_position, sort_order);

-- BEER
WITH beer_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'beer')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, NULL, true, sort_order, false
FROM beer_sec
CROSS JOIN (
  VALUES
    ('Bud Light',      4.99, 0),
    ('Corona',         4.99, 1),
    ('Heineken',       4.99, 2),
    ('Stella Artois',  4.99, 3),
    ('Michelob Ultra', 4.99, 4)
) AS v(name, price, sort_order);

-- WHITE WINE
WITH ww_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'white-wine')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM ww_sec
CROSS JOIN (
  VALUES
    ('Aimè Terre di Chieti – Sauvignon Blanc', 11.00,
      'Dry and fresh with aromatic fruit flavors. $11 glass / $38 bottle.', 0),
    ('Soave Classico', 11.00,
      'Light to medium-bodied with crisp acidity and a dry finish. $11 glass / $38 bottle.', 1),
    ('Verdicchio dei Castelli di Jesi', 11.00,
      'Dry and refreshing Italian white with a slight nutty or mineral character. $11 glass / $38 bottle.', 2),
    ('Moscato', 11.00,
      'Sweet and aromatic white wine with floral notes. $11 glass / $38 bottle.', 3)
) AS v(name, price, description, sort_order);

-- RED WINE
WITH rw_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'red-wine')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM rw_sec
CROSS JOIN (
  VALUES
    ('Sangue di Giuda (“Blood of Judas”)', 11.00,
      'Sweet, fruity, and smooth. $11 glass / $38 bottle.', 0),
    ('Mark West – Pinot Noir', 11.00,
      'Notes of black cherry, raspberry, and sage. $11 glass / $38 bottle.', 1),
    ('Impero Collection – Premium Red', 11.00,
      'Full-bodied, dry, and smooth with balanced tannins. $11 glass / $38 bottle.', 2),
    ('Pinot Noir – Trevenezie', 11.00,
      'Bright ruby red with floral notes of violet. $11 glass / $38 bottle.', 3)
) AS v(name, price, description, sort_order);

-- ROSE WINE
WITH rose_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'rose-wine')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM rose_sec
CROSS JOIN (
  VALUES
    ('Rosato “Mon Amorè”', 11.00,
      'Bright and fresh with vibrant fruit and crisp acidity. $11 glass / $38 bottle.', 0)
) AS v(name, price, description, sort_order);

-- CHAMPAGNE
WITH champ_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'champagne')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, NULL, true, sort_order, false
FROM champ_sec
CROSS JOIN (
  VALUES
    ('Glass of Champagne', 10.99, 0),
    ('Glass of Prosecco',  12.99, 1)
) AS v(name, price, sort_order);

-- MOCKTAILS
WITH mock_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'mocktails')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM mock_sec
CROSS JOIN (
  VALUES
    ('Virgin Mojito',              12.99, 'Fresh mint, lime juice, sugar, club soda, and ice.', 0),
    ('Strawberry Lemonade Spritzer',12.99, 'Muddled strawberries, lemon juice, simple syrup, club soda.', 1),
    ('Pineapple Ginger Punch',     12.99, 'Pineapple juice, lime juice, ginger syrup, club soda.', 2),
    ('Cranberry Rosemary Refresher',12.99,'Cranberry juice, rosemary syrup, lime, orange bitters, topped with club soda.', 3),
    ('Guava Berry Breeze',         12.99, 'Guava and wildberry purées, lime, mint, topped with club soda and ginger beer.', 4),
    ('Lavender Fizz',              12.99, 'Lavender purée, lemon juice, topped with club soda.', 5)
) AS v(name, price, description, sort_order);

-- BREAKFAST
WITH bf_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'breakfast')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM bf_sec
CROSS JOIN (
  VALUES
    ('Build Your Omelette', 14.99,
      'Start with (3) eggs and choose (3) of the following items: cheddar cheese, mixed bell peppers, onion, or diced tomatoes. Served with homemade potato wedges.',
      0),
    ('Chicken and Egg Sandwich', 14.99,
      'Chicken, scrambled egg, cheese, lettuce and tomato on ciabatta, with homemade potato wedges.',
      1),
    ('Breakfast Burrito', 11.99,
      'Scrambled eggs, cheddar cheese, lettuce wrapped in a warm tortilla. Served with homemade potato wedges.',
      2)
) AS v(name, price, description, sort_order);

-- HOT DRINKS
WITH hot_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'hot-drinks')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM hot_sec
CROSS JOIN (
  VALUES
    ('Black Coffee', 3.99, 'Medium – $4.99.', 0),
    ('Café Latte',   5.99, 'Espresso with steamed milk and a light layer of foam. Choice of milk: Whole, Almond, Oat.', 1),
    ('Chai Tea Latte',4.99,'Aromatic spices with your choice of Whole, Almond, or Oat milk.', 2),
    ('Espresso (2 shots)', 3.99, NULL, 3),
    ('Americano', 4.99, NULL, 4),
    ('Black Tea', 4.99, 'Cup $4.99 / Pot $12.99.', 5),
    ('Mint Tea',  4.99, 'Cup $4.99 / Pot $14.99.', 6),
    ('Macchiato', 5.99, NULL, 7),
    ('Extras',    0.00,
      'Add an extra shot of espresso $1.99. Add caramel drizzle $0.99. Choice of milk: Whole, Almond, Oat.',
      8)
) AS v(name, price, description, sort_order);

-- COLD DRINKS
WITH cold_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'cold-drinks')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, name, price, description, true, sort_order, false
FROM cold_sec
CROSS JOIN (
  VALUES
    ('Cranberry Juice', 4.99, NULL, 0),
    ('Pineapple Juice', 4.99, NULL, 1),
    ('Lemonade',        4.99, NULL, 2),
    ('Soda',            4.99, 'Coke, Diet Coke, Fanta, Ginger Ale, Root Beer, Sprite.', 3),
    ('Fiji Water',      4.99, NULL, 4),
    ('Sparkling Water', 4.99, NULL, 5),
    ('Club Soda',       4.99, NULL, 6),
    ('Red Bull',        5.99, NULL, 7)
) AS v(name, price, description, sort_order);

-- HOOKAH
WITH hook_sec AS (SELECT id AS section_id FROM menu_sections WHERE slug = 'hookah')
INSERT INTO menu_items (section_id, name, price, description, is_visible, sort_order, is_featured)
SELECT section_id, 'Hookah', 26.99,
       'Happy Hour Hookah – $14.99. Minimum choice 2 flavors. Add a 3rd flavor for $2.99.',
       true, 0, false
FROM hook_sec;
