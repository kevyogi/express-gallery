/*jshint esversion:6*/

const express = require('express');
const router = express.Router();
const db = require('../models');
const Gallery = db.gallery;
const user = db.user;



router.get('/', (req, res) => {
  return Gallery.findAll()
  .then ( (theGallery) => {
    res.render('partials/gallery', {Gallery: theGallery});
  });
});

router.post('/', (req, res) => {
  const title = req.body.title;
  const link = req.body.link;
  const description = req.body.description;
  return Gallery.create({title: title, link: link, description: description, userId: req.user.id})
  .then ((newGallery) => {
    return res.redirect('/gallery');
  });
});


router.get('/new', isAuthenticated, (req, res) => {
  let locals = {
    user: req.user.username
  }
  res.render('partials/new', locals);
});

router.get('/:id', (req, res) => {
  const galleryId = req.params.id;
  return Gallery.findById(galleryId)
  .then ((theGallery) => {
    return user.findById(theGallery.userId)
    .then((theUser) => {
      let locals = {
        user: theUser.username,
        title: theGallery.dataValues.title,
        link: theGallery.dataValues.link,
        description: theGallery.dataValues.description
      }
      return res.render('partials/gallery_single', locals);
    });
  });
});

router.get('/:id/edit', isAuthenticated, (req, res) => {
  const galleryId = req.params.id;
    return Gallery.findById(galleryId)
      .then((theGallery) => {
        if(req.user.id === theGallery.userId){
          console.log(theGallery.dataValues);
          let locals = {
            id: req.params.id,
            user: req.user.username,
            title: theGallery.dataValues.title,
            link: theGallery.dataValues.link,
            description: theGallery.dataValues.description
          }
          return res.render('partials/edit', locals);
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
    let locals = {
      id: galleryId
    }
    return res.redirect('/gallery');
  });
});

router.put('/:id', (req, res) => {
  const galleryId = req.params.id;
  const title = req.body.title;
  const link = req.body.link;
  const description = req.body.description;
  return Gallery.findById(galleryId)
    .then((theGallery) => {
      Gallery.update({
        title: title,
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