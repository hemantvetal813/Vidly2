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
  createdDate: { type: Date, default: Date.now },
  modifiedDate: { type: Date, default: Date.now },
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
  const course = new Course(req.body);
  try {
    const result = await course.save();
    res.send(result);
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/", async (req, res) => {
  try {
    const course = await Course.find().sort({ name: 1 });
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
// Course.find({Author: /.*Dinesh.*/i})//dinesh anywhere contains inSensitive case

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

router.put("/:_id", async ({ body, params }, res) => {
  const course = await Course.findById(params._id);
  if (!course) return res.send("course not found");
  try {
    Object.keys(body).forEach(item => {
      if (typeof body[item] !== "object") course[item] = body[item]; //to avoid updating comments
      course.modifiedDate = Date.now();
    });
    // course.set({
    //   name: req.body.name,
    //   Author: req.body.Author,
    //   // price: body.price,
    //   modifiedDate: Date.now()
    // });
    const result = await course.save();
    res.send(result);
  } catch (err) {
    for (field in err.errors) res.send(err.errors[field]);
  }
});

router
  .route("/:_id/comments")
  .post(async (req, res) => {
    const course = await Course.findById(req.params._id);
    if (!course) return res.send("course not found");
    try {
      course.comments.push(req.body);
      course.modifiedDate = Date.now();

      const result = await course.save();
      res.send(result);
    } catch (error) {
      for (field in error.errors) res.send(error.errors[field]);
    }
  })
  .get(async (req, res) => {
    const course = await Course.findById(req.params._id);
    if (!course) return res.send("course not found");
    try {
      const comments = await course.comments;
      res.send(comments);
    } catch (error) {
      res.send(error);
    }
  });

//this is also a way to write one single route and chain all methods get,put,post,delete
router
  .route("/:_id/comments/:commentID")
  .get(async (req, res) => {
    const course = await Course.findById(req.params._id);
    if (!course) return res.send("course not found");
    try {
      const comment = await course.comments.id(req.params.commentID);
      if (!comment) res.send("comment does not exist");
      res.send(comment);
    } catch (error) {
      for (field in error.errors) res.send(error.errors[field]);
    }
  })
  .put(async (req, res) => {
    try {
      const course = await Course.findById(req.params._id);
      if (!course) return res.send("course not found");
      const comment = await course.comments.id(req.params.commentID);
      if (!comment) return res.send("comment does not exist");
      comment.comment = req.body.comment;
      comment.modifiedDate = course.modifiedDate = Date.now();
      const result = await course.save();
      res.send(result);
    } catch (error) {
      for (field in error.errors) res.send(error.errors[field]);
    }
  })
  .delete(async (req, res) => {
    try {
      const course = await Course.findById(req.params._id);
      if (!course) return res.send("course not found");
      const comment = await course.comments.id(req.params.commentID);
      if (!comment) return res.send("comment does not exist");
      course.comments.id(req.params.commentID).remove();
      course.modifiedDate = Date.now();
      const result = await course.save();
      res.send(result);
    } catch (error) {
      for (field in error.errors) res.send(error.errors[field]);
    }
  });

module.exports = router;
