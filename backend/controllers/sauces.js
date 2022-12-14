const Sauce = require('../models/sauce');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    sauce: req.body.sauce,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.like = 0;
  sauce.dislike = 0;
  sauce.userLike = [""];
  sauce.userDislike = [""];
  sauce.save()
    .then(() => { res.status(201).json({ message: 'Sauce enregistrée !' }) })
    .catch(error => { res.status(400).json({ error }) })
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };


  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(403).json({ message: 'unauthorized request' });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce supprimée! ' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

function removeItemFromList(list, item) {
  const index = list.indexOf(item);
  if (index > -1) { // only splice array when item is found
    list.splice(index, 1); // 2nd parameter means remove one item only
  }

}

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then(sauceObject => {
    const userId = req.body.userId;
    const userLike = req.body.like;

    removeItemFromList(sauceObject.usersLiked, userId);
    removeItemFromList(sauceObject.usersDisliked, userId);

    console.log(sauceObject);
    if (userLike === 1) {
      sauceObject.usersLiked.push(userId);
    }

    else if (userLike === -1) {
      sauceObject.usersDisliked.push(userId);
    }

    sauceObject.dislike = sauceObject.usersDisliked.length;
    sauceObject.like = sauceObject.usersLiked.length;

    Sauce.updateOne({ _id: req.params.id }, sauceObject)
      .then(() => res.status(200).json({ message: "Bien marché" }))
      .catch(error => res.status(401).json({ error }));


  })
    .catch(error => { res.status(400).json({ error }) });

};