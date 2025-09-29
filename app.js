const express = require('express');
const axios = require('axios');
const app = express();

// Express setup
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load default page
app.get('/', (req, res) => {
  res.render('index');
});

// Post cocktail page
app.post('/cocktail', async (req, res) => {
  const ingredient = req.body.ingredient;

  try {
    // Get cocktails with specified ingredient
    const searchUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`;
    const searchRes = await axios.get(searchUrl);
    const drinks = searchRes.data.drinks;

    if (!drinks || drinks.length === 0) {
      return res.render('result', { cocktail: null, error: "No cocktails found with that ingredient." });
    }

    // Pick random drink from cocktail list
    const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];

    // Get cocktail info
    const detailUrl = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${randomDrink.idDrink}`;
    const detailRes = await axios.get(detailUrl);
    const cocktail = detailRes.data.drinks[0];

    res.render('result', { cocktail, error: null });

  } catch (err) {
    console.error(err);
    res.render('result', { cocktail: null, error: "Something went wrong. Try again." });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
