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
  const user = req.body.user;
  const link = req.body.link;
  const description = req.body.description;
  return Gallery.create({user: user, link: link, description: description, userId: req.user.id})
  .then ((newGallery) => {
    return res.redirect('/gallery');
  });
});

router.get('/new', (req, res) => {
  req.body
  res.render('partials/new');
});

router.get('/:id', (req, res) => {
  const galleryId = req.params.id;
  return Gallery.findById(galleryId)
  .then ((theGallery) => {
    return res.render('partials/gallery_single', theGallery.dataValues);
  });
});

router.get('/:id/edit', isAuthenticated, (req, res) => {
  const galleryId = req.params.id;
  console.log(req.user.id);
  console.log(req.body);
    return Gallery.findById(galleryId)
      .then((theGallery) => {
        if(req.user.id === theGallery.userId){
          return res.render('partials/edit', theGallery.dataValues);
        }else{
          return res.redirect('/');
        }
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

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()) {next();}
  else{res.redirect('/')}
}


module.exports = router;