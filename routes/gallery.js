/*jshint esversion:6*/

const express = require('express');
const router = express.Router();
const db = require('../models');
const Gallery = db.gallery;
const Author = db.author;


router.get('/', (req, res) => {
  return Gallery.findAll()
  .then ( (theGallery) => {
    res.render('partials/gallery', {Gallery: theGallery});
  });
});

router.post('/', (req, res) => {
  const author = req.body.author;
  const link = req.body.link;
  const description = req.body.description;
  return Gallery.create({author: author, link: link, description: description})
  .then ((newGallery) => {
    return res.redirect('/gallery');
  });
});

router.get('/new', (req, res) => {
  res.render('partials/new');
});

router.get('/:id', (req, res) => {
  const galleryId = req.params.id;
  return Gallery.findById(galleryId)
  .then ((theGallery) => {
    return res.render('partials/gallery_single', theGallery.dataValues);
  });
});

router.get('/:id/edit', (req, res) => {
  const galleryId = req.params.id;
  return Gallery.findById(galleryId)
    .then((theGallery) => {
      return res.render('partials/edit', theGallery.dataValues);
    });
});

router.delete('/:id', (req, res)=>{
  const galleryId = req.params.id;
  return Gallery.destroy({
    where: {
      id: galleryId
    }
  })
  .then(() => {
    return res.redirect('/gallery');
  });
});

router.put('/:id', (req, res) => {
  console.log(req);
  const galleryId = req.params.id;
  const author = req.body.author;
  const link = req.body.link;
  const description = req.body.description;
  return Gallery.findById(galleryId)
    .then((theGallery) => {
      Gallery.update({
        author: author,
        link: link,
        description: description
      }, {where: {
            id: galleryId}
    });
      res.redirect('/gallery');
 });
});


module.exports = router;