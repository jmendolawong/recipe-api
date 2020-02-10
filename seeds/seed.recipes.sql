TRUNCATE recipes RESTART IDENTITY CASCADE;

INSERT INTO recipes(name, note, url) VALUES 
  (
    'Apple Pie', 'I love this recipe because it has apples, pears and bananas',
    'https://www.bbcgoodfood.com/recipes/collection/apple'
  ),
  (
    'Fruit Medley', 'I love this recipe because it has peaches, oranges and grapes',
    'https://www.bbcgoodfood.com/recipes/collection/apple'
  ),
  (
    'Chicken Pot Pie', 'The crust is amazing!',
    'https://www.bbcgoodfood.com/recipes/collection/apple'
  ),
  (
    'So Delicious', 'So tasty and delicious',
    'https://www.bbcgoodfood.com/recipes/collection/apple'
  ),
  (
    'Good Food', 'Love this!!!',
    'https://www.bbcgoodfood.com/recipes/collection/apple'
  );
