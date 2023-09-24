const mongoCollections = require("../config/mongoCollections");
const dogs = mongoCollections.dogs;
const helper = require("../helpers");
const { ObjectId } = require("mongodb");

const getDogById = async (id) => {
  id = helper.checkId(id, "id");
  const dogCollection = await dogs();
  const dog = await dogCollection.findOne({ _id: ObjectId(id) });
  if (dog === null) throw "Error: no dog found with that id";
  return dog;
};

let getAllDogs = async () => {
  const dogCollection = await dogs();
  const dogList = await dogCollection.find({}).toArray();
  if (!dogList) throw "Error: could not get all dogs";
  return dogList;
};

const addDog = async (
  name,
  birthday,
  breed,
  height,
  weight,
  sex,
  specialNeeds,
  picture
) => {
  name = helper.checkName(name);
  birthday = helper.checkBirthday(birthday);
  age = helper.calcAge(birthday);
  breed = helper.checkBreed(breed);
  height = helper.checkHeight(height);
  weight = helper.checkWeight(weight);
  sex = helper.checkSexInput(sex);
  specialNeeds = helper.checkSpecialNeeds(specialNeeds);
  picture = helper.checkPicture(picture);
  const dogCollection = await dogs();

  let newDog = {
    name: name,
    birthday: birthday,
    age: age,
    breed: breed,
    height: height,
    weight: weight,
    sex: sex,
    specialNeeds: specialNeeds,
    picture: picture,
    likes: 0,
    comments: []
  };

  const insertInfo = await dogCollection.insertOne(newDog);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Error: could not add dog";
  const newId = insertInfo.insertedId.toString();
  const dog = await getDogById(newId);
  return dog;
};

const removeDog = async (dogId) => {
  dogId = helper.checkId(dogId, "id for rescue dog");
  const dogCollection = await dogs();
  let dog;
 
  const dogList = await dogCollection.find({}).toArray();
  for (let doggo of dogList) {
    if (doggo._id.toString() === dogId.toString()) {
      dog = doggo;
      break;
    }
  }
  if (!dog){
    throw `Error: dog was not found`;
  }
  const deletionInfo = await dogCollection.deleteOne({
    _id: ObjectId(dogId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Error: could not remove dog with id of ${dogId.toString()}`;
  }
  return `${dog.name.trim()} has been successfully deleted!`;
};

const updateDog = async (
  dogId,
  name,
  birthday,
  breed,
  height,
  weight,
  sex,
  specialNeeds,
  picture,
  likes
) => {
  //Input checking
  dogId = helper.checkId(dogId, "id for rescue dog");
  name = helper.checkName(name);
  birthday = helper.checkBirthday(birthday);
  breed = helper.checkBreed(breed);
  age = helper.calcAge(birthday);
  height = helper.checkHeight(height);
  weight = helper.checkWeight(weight);
  sex = helper.checkSexInput(sex);
  specialNeeds = helper.checkSpecialNeeds(specialNeeds);
  picture = helper.checkPicture(picture);
  const dogCollection = await dogs();

  oldDog = {}
  try{
    oldDog = await getDogById(dogId);
  }catch(e){
    throw e;
  }

  let updatedDog = {
    name: name,
    birthday: birthday,
    breed: breed,
    height: height,
    weight: weight,
    sex: sex,
    specialNeeds: specialNeeds,
    picture: picture,
    likes: likes,
    comments: oldDog.comments
  };

  if ((updatedDog.name === oldDog.name) && (updatedDog.birthday === oldDog.birthday) && (updatedDog.breed === oldDog.breed)
  && (updatedDog.height === oldDog.height) && (updatedDog.weight === oldDog.weight) &&
  (updatedDog.sex === oldDog.sex) && (updatedDog.specialNeeds === oldDog.specialNeeds) &&
  (updatedDog.picture === oldDog.picture && updatedDog.likes === oldDog.likes)){
    throw "No changes to dog were made."
  }

  let id = new ObjectId(dogId);

  const updatedInfo = await dogCollection.updateOne({_id: id}, {$set: updatedDog});

  return await getDogById(dogId);

};

module.exports = { getDogById, getAllDogs, addDog, removeDog, updateDog};
