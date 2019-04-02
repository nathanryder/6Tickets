var express = require('express');
var router = express.Router();
var Category = require("../../models/category");

/**
 * @api {put} /categories/:categoryID Update a category
 * @apiName UpdateCategory
 * @apiGroup Categories
 *
 * @apiParam {String} categoryID
 * @apiParam {String} newName
 */
router.put("/:categoryID", function(req, res, next) {

   var id = req.params.categoryID;
   var newName = req.body.newName;
   if (!newName) {
       res.status(400).json({"error": "Invalid arguments"});
       return;
   }

   Category.updateOne({"_id": id}, {$set:{"name": newName}}, function (err, resp) {
      if (err)
          throw err;

       res.status(201).json({"success": "Updated category details"});
   });
});

/**
 * @api {delete} /categories/:categoryID Delete a category
 * @apiName DeleteCategory
 * @apiGroup Categories
 *
 * @apiParam {String} categoryID
 */
router.delete("/:categoryID", function(req, res, next) {

    var category = req.params.categoryID;

    Category.deleteOne({"_id": category}, function(err, resp) {
        if (err)
            throw err;

        res.status(200).json({"success": "Category deleted"});
    })

});

/**
 * @api {get} /categories/ Get categories
 * @apiName GetCategories
 * @apiGroup Categories
 */
router.get("/", function (req, res, next) {

    Category.find({}, function(err, resp) {
        if (err)
            throw err;

        res.status(200).json(resp);
    })

});

/**
 * @api {post} /categories/ Create a new category
 * @apiName CreateCategory
 * @apiGroup Categories
 *
 * @apiParam {String} name
 */
router.post("/", function (req, res, next) {

    var name = req.body.name;
    if (!name) {
        res.status(400).json({"error": "Invalid arguments"});
        return;
    }

    var category = new Category();
    category.name = name;

    category.save(function(err, resp) {
        if (err)
            throw err;

        res.status(201).json({
            "success": "event created",
            "_id": resp._id
        });
    });

});

module.exports = router;