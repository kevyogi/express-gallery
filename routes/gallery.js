/*jshint esversion:6*/

const express = require('express');
const router = express.Router();
const db = require('../models');
const Gallery = db.gallery;
const user = db.user;



router.get('/', (req, res) => {
  return Gallery.findAll()
  .then ((gallery) => {
    console.log(gallery);
    res.render('partials/gallery', {gallery: gallery});
  });
});

router.post('/', (req, res) => {
  const title = req.body.title;
  const link = req.body.link;
  const description = req.body.description;
  return Gallery.create({
    title: title,
    link: link,
    description: description,
    userId: req.user.id})
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
  .then((singlePhoto) => {
    return user.findById(singlePhoto.userId)
    .then((theUser) => {
      return Gallery.findAll()
      .then((entireGallery) => {
        let collection = entireGallery.slice(0, 3);
        let locals = {
          id: galleryId,
          user: theUser.username,
          title: singlePhoto.dataValues.title,
          link: singlePhoto.dataValues.link,
          description: singlePhoto.dataValues.description,
          collection: collection
        }
        return res.render('partials/gallery_single', locals);
      });
    });
  });
});


router.get('/:id/edit', isAuthenticated, (req, res) => {
  const galleryId = req.params.id;
    return Gallery.findById(galleryId)
    .then((theGallery) => {
        return user.findById(req.user.id)
        .then((user) => {
          if(req.user.id === theGallery.userId || user.role === 'admin'){
            let locals = {
              id: req.params.id,
              user: req.user.username,
              title: theGallery.dataValues.title,
              link: theGallery.dataValues.link,
              description: theGallery.dataValues.description
            }
            return res.render('partials/edit', locals);
          }else{
            return res.redirect(`/gallery/${galleryId}`);
          }
        })
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