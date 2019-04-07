var express = require('express');
var router = express.Router();
var Contact = require("../../models/contact");

/**
 * @api {post} /contacts/ Create a contact
 * @apiName AddContact
 * @apiGroup Contact
 *
 * @apiParam {String} name
 * @apiParam {String} email
 * @apiParam {String} message
 */
router.post("/", function (req, res, next) {

   var name = req.body.name;
   var email = req.body.email;
   var message = req.body.message;

   if (!name || !email || !message) {
       res.status(400).json({"error": "Invalid arguments"});
       return;
   }

   var contact = new Contact();
   contact.name = name;
   contact.email = email;
   contact.message = message;

   contact.save(function (err, resp) {
       if (err)
           throw err;

       res.status(201).json({
           "success": "Created contact",
           "_id": resp._id
       });
   });

});

/**
 * @api {delete} /contacts/:contactID Delete a contact
 * @apiName DeleteContact
 * @apiGroup Contact
 */
router.get("/:contactID", function (req, res, next) {
    var id = req.params.contactID;

    Contact.deleteOne({"_id": id}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json({"success": "Deleted contact"});
    });


});

/**
 * @api {get} /contacts/ Get contacts
 * @apiName GetContacts
 * @apiGroup Contact
 */
router.get("/", function (req, res, next) {
    Contact.find({}, function (err, resp) {
        if (err)
            throw err;

        res.status(200).json(resp);
    });
});

module.exports = router;