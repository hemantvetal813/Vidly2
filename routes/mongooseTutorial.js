const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
  comment: { type: String, required: true }
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Author: String,
  tags: {
    type: Array,
    validate: {
      validator: function(v) {
        return v && v.length > 0; //array validation: custom function validator
      },
      message: "atleast one tag must be present"
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  comments: [commentSchema],
  category: {
    type: [String],
    enum: ["coding", "mosh", "mom", "dad"],
    lowercase: true,
    trim: true
  }, //enum:this values are only allowed
  price: {
    type: Number,
    min: 10,
    max: 200,
    required: function() {
      return this.isPublished; //if its published, price is required
    },
    set: v => Math.round(v), //rounds the value if inserted in decimal
    get: v => Math.round(v) //rounds the value if fetched
  }
});

const Course = mongoose.model("Course", courseSchema);

router.post("/", async (req, res) => {
  const course = new Course({
    name: req.body.name,
    Author: req.body.Author,
    tags: req.body.tags,
    isPublished: req.body.isPublished,
    price: req.body.price
  });
  try {
    const result = await course.save();
    res.send(result);
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/", async (req, res) => {
  try {
    const course = await Course.find({});
    res.send(course);
  } catch (err) {
    for (field in err.errors) res.send(err.errors[field]);
  }
});

router.get("/:_id", async (req, res) => {
  try {
    const course = await Course.find({
      _id: req.params._id
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
  } catch (err) {
    res.send(err.message);
  }
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
