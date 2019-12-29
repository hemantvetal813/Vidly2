const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => "Connected to MOngoDB")
  .catch(err => {
    "could not connect to mongodb", err;
  });

const courseSchema = new mongoose.Schema({
  name: String,
  Author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false }
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "mongod",
    Author: "Dinesh vetal",
    tags: ["mom", "dad"],
    isPublished: true
  });
  const result = await course.save();
  console.log(result);
}
// createCourse();

router.post("/", async (req, res) => {
  const course = new Course({
    name: req.body.name,
    Author: req.body.Author,
    tags: ["mom", "dad"], //not set yet
    isPublished: req.body.isPublished
  });
  const result = await course.save();
  res.send(result);
});

router.get("/", async (req, res) => {
  const course = await Course.find({
    Author: "Dinesh vetal",
    isPublished: true
    // tags:{$in:["mom","dad"]}//"and" condtion both tags should be present
  })
    // .or([{ tags: "mom" }, { tags: "dad" }]) //pass array//"or" condition any one tag be present
    .limit(10)
    .sort({ name: 1 }) //-1 for desc, 1 for asc
    // .sort("name") //-ve string means -1
    .select({ Author: 0, date: 0 }); //1 for showing, 0 for not showing or
  // .select("-Author -date");//-ve string means 0
  // .count()//for no of documents, but remove select
  res.send(course);
});

//regex
// Course.find({Author: /^Dinesh/})//startsWith sensitive case
// Course.find({Author: /Dinesh$/i})//endsWith inSensitive case
// Course.find({Author: /.*Dinesh.*/i})//contains inSensitive case

//query operators: and, or
//   Course.find()
//    .or([{Author: "Dinesh vetal"},{isPublished: true}])//pass array
//    .and([{Author: "Dinesh vetal"},{isPublished: true}])//pass array but same as above get function

//logical operators: gt,lt,gte,lte,in,nin,eq,ne
//Course.find({price:10})
//Course.find({price:{$gt:10,$lte:20}})
//Course.find({price:{$in:[10,15,20]}})

//pagination , query=> /mongod?pageNumber=2&pageSize=10
// const pageNumber=req.query.pageNumber||2;
// const pageSize=req.query.pageSize||10;
// .skip((pageNumber-1)*pageSize)
// .limit(pageSize)

router.put("/:_id", async (req, res) => {
  const course = await Course.findById(req.params._id);
  if (!course) return res.send("course not found");

  course.set({
    name: req.body.name,
    Author: req.body.Author
  });
  const result = await course.save();
  res.send(result);
});

module.exports = router;
