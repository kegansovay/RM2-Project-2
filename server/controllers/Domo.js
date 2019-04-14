const models = require('../models');
const Domo = models.Domo;

//RENDER PAGE
const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

//CREATE NEW
const makeDomo = (req, res) => {
  if (!req.body.title || !req.body.username || !req.body.password) {
    return res.status(400).json({ error: 'RAWR! Both name and age are required.' });
  }

  const domoData = {
    title: req.body.title,
    username: req.body.username,
    password: req.body.password,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
