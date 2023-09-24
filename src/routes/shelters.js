const express = require('express');
const router = express.Router();
const data = require('../data');
const helpers = require('../helpers');
const sheltersData = data.shelters;
const reviewsData = data.reviews;
const dogsData = data.dogs;
const catsData = data.cats;
const usersData = data.users;
const xss = require('xss');

router.get('/kill_shelters', async(req, res) => {
    let shelters = await sheltersData.getAllKillShelters();
    return res.render('shelter/killShelters', {title: "Kill Shelters", shelters: shelters})
});

router.get('/add', async (req, res) => {
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    if(!loggedIn){
        return res.redirect('/');
    }
    return res.render('shelter/add', {title: "Add a Shelter", loggedIn: loggedIn, isAdmin: isAdmin});
});

router.post('/add', async(req, res) => {
    let shelterName = req.body.shelterName;
    let state = req.body.shelterState;
    let city = req.body.shelterCity;
    let killShelter = req.body.killShelter
    let time = req.body.timeKept
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;

    // if(!loggedIn){
    //     return res.redirect('/');
    // }
    let errors = [];

    try{
        shelterName = helpers.checkString(shelterName, "Shelter Name");
    } catch(e) {
        errors.push(e);
    }

    try{
        state = helpers.checkState(state, "State");
    } catch(e) {
        errors.push(e);
    }

    try{
        city = helpers.checkString(city, "City");
    } catch(e) {
        errors.push(e);
    }

    let kill = false;
    if(killShelter === "on"){
        kill = true;
    } 

    try{
         time = helpers.checkTimeKept(time, kill);
    } catch(e) {
        errors.push(e);
    }

    if(errors.length > 0){
        res.render('shelter/add', {title: "Add a Shelter", loggedIn: loggedIn, isAdmin: isAdmin, error: errors,
        name: shelterName,
        city: city,
        state: state,
        time: time});
        return;
    }

    try{
        await sheltersData.addShelter(shelterName, city, state, kill, time.toString());
    } catch(e) {
        res.render('shelter/add', {title: "Add a Shelter", loggedIn: loggedIn, isAdmin: isAdmin, error: e,
        name: shelterName,
        city: city,
        state: state,
        time: time});
        return;
    }
    res.render('shelter/add', {title: "Add a Shelter", loggedIn: loggedIn, isAdmin: isAdmin, error: "Shelter successfully added"});
    return;
});

router.get('/remove', async (req, res) => {
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    if(!loggedIn) {
        return res.redirect('/');
    }
    return res.render('shelter/remove', {title: "Remove a Shelter", loggedIn: loggedIn, isAdmin: isAdmin});
});

router.post('/remove', async(req, res) => {
    let id = req.body.shelterID;
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    
    try{
        id = helpers.checkId(id, "shelter ID");
    } catch(e) {
        const shelters = await sheltersData.getAllShelters();
        res.render('shelter/remove', {title: "Remove a Shelter", loggedIn: loggedIn, isAdmin: isAdmin, error: e});
    }
    try{
        if(!await sheltersData.containsShelter(id)){
            throw "Error: no shelter with that id";
        }
    } catch(e) {
        console.log(e);
        res.render('shelter/remove', {title: "Remove a Shelter", loggedIn: loggedIn, isAdmin: isAdmin, error: e});
        return;
    }
    try{
        await sheltersData.removeShelter(id);
    } catch(e) {
        console.log(e);
        res.render('shelter/remove', {title: "Remove a Shelter", loggedIn: loggedIn, isAdmin: isAdmin, error: e});
        return;
    }
    res.render('shelter/remove', {title: "Remove a Shelter", loggedIn: loggedIn, isAdmin: isAdmin, error: "Shelter successfully removed"});
    return;

});


router.get('/:id/delete_pet', async function(req, res){
    return res.render('pet/deletePet', {title: "Delete Pet", error: "", loggedIn: req.session.user});
});

router.post('/:id/delete_pet', async function(req, res){
    let shelteId = req.params.id;
    let petId = req.body.petID;
    let type = req.body.petType;
    let errors = [];

    try{
        helpers.checkId(petId);
    } catch(e){
        errors.push(e);
    }
    try{
        helpers.checkAnimalType(type);
    } catch(e) {
        errors.push(e);
    }
    if(errors.length > 0){
        return res.render('pet/deletePet', {title: "Delete Pet", error: errors, loggedIn: req.session.user});  
    }
    try{
        if(type === 'dog'){
            await dogsData.removeDog(petId);
            await sheltersData.removeRescuePet(shelteId, petId);
        } else{
            await catsData.removeCat(petId);
            await sheltersData.removeRescuePet(shelteId, petId);
        }
    } catch(e){
        return res.render('pet/deletePet', {title: "Delete Pet", error: e, loggedIn: req.session.user}); 
    }
    return res.render('pet/deletePet', {title: "Delete Pet", error: "Pet deleted successfully", loggedIn: req.session.user});
});


router.get('/', async (req, res) => {
    const shelters = await sheltersData.getAllShelters();
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    res.render('shelter/index', {title: "Shelters", shelters: shelters, loggedIn: loggedIn, isAdmin: isAdmin});
});

router.post('/', async (req, res) => {
    let city = req.body.theCity;
    let state = req.body.theState;

    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;

    let errors =[];

    try{
        city = helpers.checkString(city, "Shelter city")
    } catch (e) {
        errors.push(e);
    }

    try{   
        state = helpers.checkState(state);
    } catch (e) {
        errors.push(e);
    }

    const allshelters = await sheltersData.getAllShelters();

    if(errors.length > 0){
        return res.render('shelter/index', {title: "Shelters", shelters: allshelters, loggedIn: loggedIn, isAdmin: isAdmin, city: city, state: state, error: errors});
    }

    let shelters;
    try{
        shelters = await sheltersData.findSheltersInCity(city, state);
    } catch(e){
        errors.push(e);
        return res.render('shelter/index', {title: "Shelters", shelters: allshelters, loggedIn: loggedIn, isAdmin: isAdmin, city: city, state: state, error: errors});
    }
    return res.render('shelter/sheltersSearch', {title: "Shelter Search", shelters: shelters, city: city, state: state});
});


router.post('/:id', async (req, res) => {
    let shelterId = req.params.id;
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    
    if(!loggedIn){
        res.json({error: 'Error: Must be logged in to leave a review', loggedIn: loggedIn, isAdmin: isAdmin});
        return;
    }
    try{
        shelterId = helpers.checkId(shelterId, "Shelter ID");
    } catch(e) {
        return res.status(400).render('shelter/single', {title: "Name of Shelter: ", error: e, loggedIn: loggedIn, isAdmin: isAdmin});
    }
    let shelter;
    try{
        shelter = await sheltersData.getShelterById(shelterId);
    } catch(e) {
        return res.status(400).render('shelter/single', {title: "Name of Shelter: ", loggedIn: loggedIn, isAdmin: isAdmin});
    }
    try{
        await reviewsData.addReview(xss(req.body.reviewerName), xss(req.body.review), 
            (xss(req.body.rating)), shelterId, loggedIn);
            return res.status(200).render('shelter/single', {title: "Name of Shelter: ", shelter: shelter, loggedIn: loggedIn, isAdmin: isAdmin});
    } catch(e) {
        res.status(400).render('shelter/single', {title: "Name of Shelter: ", error: e, loggedIn: loggedIn, isAdmin: isAdmin});
        return;
    }
});


router.get('/:id', async (req, res) => {
    let id = req.params.id;
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    try{
        id = helpers.checkId(id, "shelter ID");
    } catch(e) {
        const shelters = await sheltersData.getAllShelters();
        return res.status(400).render('shelter/index', {title: "Shelters", shelters: shelters, loggedIn: loggedIn, isAdmin: isAdmin});
    }
    try{
        const shelter = await sheltersData.getShelterById(req.params.id);
        return res.render('shelter/single', {title: "Name of Shelter: ", shelter: shelter, loggedIn: loggedIn, isAdmin: isAdmin});
    } catch(e){
        const shelters = await sheltersData.getAllShelters();
        return res.status(400).render('shelter/index', {title: "Shelters", shelters: shelters, loggedIn: loggedIn, isAdmin: isAdmin});
    }
});

router.post('/:id/delete_review', async(req, res) => {
    let shelterId = req.params.id;
    let reviewId = req.body.reviewID;
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    let review;
    if(!loggedIn){
        return res.redirect('/');
    }
    try{
        reviewId = helpers.checkId(reviewId, "review id");
        shelterId = helpers.checkId(shelterId, "Shelter ID");
        review = await reviewsData.getReviewByUser(shelterId,loggedIn);

    } catch(e) {
        res.render('shelter/deletereview', {title: "Delete Review", error: e, review: review, loggedIn: loggedIn, isAdmin: isAdmin});
        return;
    }

    try{
        await reviewsData.deleteReview(reviewId,shelterId,loggedIn);
        return res.redirect(302, `/shelters/${shelterId}`);
    } catch(e) {
        res.render('shelter/deletereview', {title: "Delete Review", error: e, review: review, loggedIn: loggedIn, isAdmin: isAdmin});
        return;
    }
    
});

router.post('/:id/save', async(req, res) => {
    let id = req.params.id;
    let loggedIn = req.session.user;
    let errors =[];
    try{
        id = helpers.checkId(id, "pet id");
    } catch(e) {
        errors.push(e);
    }

    if(errors.length > 0){
        return res.render('shelter/saveShelter', {title: "Save this shelter?", error: errors, loggedIn: loggedIn});
    }

    try{
        await usersData.saveShelter(loggedIn, id)
    } catch(e) {
        errors.push(e);
    }

    if(errors.length > 0){
        return res.render('shelter/saveShelter', {title: "Save this shelter?", error: errors, loggedIn: loggedIn});
    }
    
    return res.render('shelter/saveShelter', {title: "Save this shelter?", error: "Shelter has been saved", loggedIn: loggedIn});
});

router.get('/:id/save', async(req, res) => {
    let loggedIn = req.session.user;
    return res.render('shelter/saveShelter', {title: "Save this shelter?", loggedIn: loggedIn})
});

router.post('/:id/remove', async(req, res) => {
    let id = req.params.id;
    let loggedIn = req.session.user;
    let errors =[];
    try{
        id = helpers.checkId(id, "shelter id");
    } catch(e) {
        errors.push(e);
    }

    if(errors.length > 0){
        return res.render('shelter/saveShelter', {title: "Save this shelter?", error: errors, loggedIn: loggedIn});
    }

    try{
        await usersData.removeShelter(loggedIn, id)
    } catch(e) {
        errors.push(e);
    }

    if(errors.length > 0){
        return res.render('shelter/removeShelter', {title: "Remove this shelter?", error: errors, loggedIn: loggedIn});
    }
    
    return res.render('shelter/removeShelter', {title: "Remove this shelter?", error: "Shelter has been removed", loggedIn: loggedIn});
});

router.get('/:id/remove', async(req, res) => {
    let loggedIn = req.session.user;
    return res.render('shelter/removeShelter', {title: "Remove this shelter?", loggedIn: loggedIn})
});

router.get('/delete_review', async(req, res) => {
    let shelterId = req.params.id;
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    let review;
    if(!loggedIn){
        return res.redirect('/');
    }
    try {
        shelterId = helpers.checkId(shelterId, "id for shelter");
        review = await reviewsData.getReviewByUser(shelterId,loggedIn);
    }catch(e) {
        return res.render('shelter/deletereview', {title: "Delete Review", error: e, review: review, loggedIn: loggedIn, isAdmin: isAdmin});
    }
    res.render('shelter/deletereview', {title: "Delete Review", review: review, loggedIn: loggedIn, isAdmin: isAdmin});
    return;
});

router.get('/:id/edit_review', async (req, res) => {
  let shelterId = req.params.id;
  let loggedIn = req.session.user;
  let review;
  try {
      shelterId = helpers.checkId(shelterId, "id for shelter");
      review = await reviewsData.getReviewByUser(shelterId,loggedIn);
  }catch(e) {
      //console.log(e);
      const shelters = await sheltersData.getAllShelters();
      return res.status(400).render('shelter/editreview', {title: "Name of Shelter: ", error: e, loggedIn: loggedIn, review: review});
  }
  res.render('shelter/editreview', {title: "Edit Review", loggedIn: loggedIn, review: review});
  return;
});

router.post('/:id/edit_review', async (req, res) => {
  let shelterId = req.params.id;
  let loggedIn = req.session.user;
  let review;
  let reviewtext = req.body.review;
  let rating = req.body.rating;
  let reviewerName = req.body.name;

  if(!loggedIn){
      res.json({error: 'Error: Must be logged in to edit a review', loggedIn: loggedIn});
      return;
  }
  try{
      shelterId = helpers.checkId(shelterId, "Shelter ID");
      reviewerName = helpers.checkPersonName(reviewerName);
      reviewtext = helpers.checkString(reviewtext, "review");
      rating = helpers.checkRating(rating);
      review = await reviewsData.getReviewByUser(shelterId,loggedIn);
  } catch(e) {
      console.log(e);
      return res.status(400).render('shelter/editreview', {title: "Name of Shelter: ", error: e, loggedIn: loggedIn, review: review});
  }
  let shelter;
  try{
      shelter = await sheltersData.getShelterById(shelterId);
  } catch(e) {
      return res.status(400).render('shelter/editreview', {title: "Name of Shelter: ", error: e, loggedIn: loggedIn, review: review});
  }
  try{
      await reviewsData.updateReview(xss(req.body.name), xss(req.body.review), 
          (xss(req.body.rating)), review._id.toString(), shelterId);
          return res.redirect(302, `/shelters/${shelterId}`);
  } catch(e) {
      console.log(e);
      return res.status(400).render('shelter/editreview', {title: "Name of Shelter: ", error: e, loggedIn: loggedIn, review: review});
  }
});

router.get('/:id/add_pet', async function(req, res){
    return res.render('pet/addPet', {title: "Add Pet", error: ""});
});

router.post('/:id/add_pet', async function(req, res){
    let shelterId = req.params.id;
    let errors = [];

    let name = xss(req.body.petName);
    try{
        name = helpers.checkName(name);
    } catch(e) {
        errors.push(e + " (name) ");
    }

    let birthday = xss(req.body.birthday);
    try{
        birthday = helpers.checkBirthday(birthday);
    } catch(e) {
        errors.push(e + " (birthday) ");
    }

    let age = helpers.calcAge(birthday);

    let breed = xss(req.body.breed);
    try{
        breed = helpers.checkBreed(breed);
    } catch(e) {
        errors.push(e + " (breed) ");
    }

    let height = xss(req.body.height);
    try{
        height = helpers.checkHeight(height);
    } catch(e) {
        errors.push(e + " (height) ")
    }

    let weight = xss(req.body.weight);
    try{
        weight = helpers.checkWeight(weight);
    } catch(e) {
        errors.push(e + " (weight) ")
    }

    let sex = xss(req.body.sex);
    try{
        sex = helpers.checkSexInput(sex);
    } catch(e) {
        errors.push(e + " (sex) ");
    }

    let needs = xss(req.body.needs);
    try{
        needs = helpers.checkSpecialNeeds(needs);
    } catch(e) {
        errors.push(e)
    }

    let type = xss(req.body.type);
    try{
        type = helpers.checkAnimalType(type);
    } catch(e) {
        errors.push(e + " (type) ")
    }

    let picture;
    if(type.toLowerCase()==='cat'){
        picture = 'public/petImages/cat-tilly.jpeg'
    }else{
        picture = 'public/petImages/lab-retriever-joani.jpeg'
    }

    if(errors.length > 0){
        return res.render('pet/addPet', {title: "Add Pet", error: errors, 
            name: name,
            birthday: birthday,
            breed: breed,
            height: height,
            weight: weight,
            sex: sex,
            needs: needs,
            picture: picture,
            type: type});
    }

    if(type === 'dog'){
        try{
            let dog = await dogsData.addDog(name, birthday, breed, height, weight, sex, needs, picture);
            await sheltersData.addRescueDog(shelterId, dog._id.toString());
        } catch(e) {
            return res.render('pet/addPet', {title: "Add Pet", error: e, 
            name: name,
            birthday: birthday,
            breed: breed,
            height: height,
            weight: weight,
            sex: sex,
            needs: needs,
            picture: picture,
            type: type});
        }
    } else {
        try{
            let cat = await catsData.addCat(name, birthday, height, weight, sex, needs, picture);
            await sheltersData.addRescueCat(shelterId, cat._id.toString());
        } catch(e) {
            return res.render('pet/addPet', {title: "Add Pet", error: e, 
            name: name,
            birthday: birthday,
            breed: breed,
            height: height,
            weight: weight,
            sex: sex,
            needs: needs,
            picture: picture,
            type: type});
        }
    }
    return res.render('pet/addPet', {title: "Add Pet", error: "Pet added successfully"});
});
router.post('/:id/delete_review', async(req, res) => {
    let shelterId = req.params.id;
    let reviewId = req.body.reviewID;
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    let review;
    if(!loggedIn){
        return res.redirect('/');
    }
    try{
        reviewId = helpers.checkId(reviewId, "review id");
        shelterId = helpers.checkId(shelterId, "Shelter ID");
        review = await reviewsData.getReviewByUser(shelterId,loggedIn);

    } catch(e) {
        //console.log(e);
        res.render('shelter/deletereview', {title: "Delete Review", error: e, review: review, loggedIn: loggedIn, isAdmin: isAdmin});
        return;
    }
    try{
        await reviewsData.deleteReview(reviewId,shelterId,loggedIn);
        return res.redirect(302, `/shelters/${shelterId}`);
    } catch(e) {
      console.log(e);
        res.render('shelter/deletereview', {title: "Delete Review", error: e, review: review, loggedIn: loggedIn, isAdmin: isAdmin});
        return;
    }
    
});

router.get('/:id/delete_review', async(req, res) => {
    let shelterId = req.params.id;
    let loggedIn = req.session.user;
    let isAdmin = req.session.admin;
    let review;
    if(!loggedIn){
        return res.redirect('/');
    }
    try {
        shelterId = helpers.checkId(shelterId, "id for shelter");
        review = await reviewsData.getReviewByUser(shelterId,loggedIn);
    }catch(e) {
        const shelters = await sheltersData.getAllShelters();
        return res.render('shelter/deletereview', {title: "Delete Review", error: e, review: review, loggedIn: loggedIn, isAdmin: isAdmin});
    }
    res.render('shelter/deletereview', {title: "Delete Review", review: review, loggedIn: loggedIn, isAdmin: isAdmin});
    return;
});

module.exports = router;
