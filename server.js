const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const exphbs = require('express-handlebars');
const PORT = 8888;

const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.listen(PORT, () => {
  db.sequelize.sync({ force: true })
  console.log(`Listening on port: ${PORT}`);
});