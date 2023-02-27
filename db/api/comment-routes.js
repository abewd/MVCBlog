const router = require("express").Router();
// TODO: route the path of the comments
const { Comment } = require();
// TODO: route to utils and then authentication
const withAuth = require("");

// Saving comments

// Get through a request and response all the comments
router.get("/", (req, res) => {
  // find all the comments
  Comment.findAll({})
    // and then put them in the variable commentData as a json
    .then((commentData) => res.json(commentData))
    // If there is an issue then display it as a 500 error in json
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create a comment

// Request and respond
router.post("/", withAuth, (req, res) => {
  if (req.session) {
    Comment.create({
      // display that the credentials are needed
      comment_text: req.body.comment_text,
      // request user id
      user_id: req.session.user_id,
      // request user pw
      post_id: req.body.post_id,
    })
      // then convert commentData to json
      .then((commentData) => res.json(commentData))
      // dipslay errors if they occur
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  }
});

// Updating a comment

router.put("/:id", withAuth, (req, res) => {
  Comment.update(
    {
      comment_text: req.body.comment_text,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((commentData) => {
      if (!commentData) {
        res.status(404).json({ message: "no comment found with this ID" });
        return;
      }
      res.json(commentData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Deleting a comment
// searching id with an id parameter as per other sessions
router.delete("/:id", withAuth, (req, res) => {
  // destroy comment by ID
  Comment.destroy({
    where: {
      id: req.params.id,
    },
    // if you cant find the comment via ID then display an error message
  }).then((commentData) => {
    if (!commentData) {
      res.status(404).json({ message: "no comment found with this ID" });
    }
  });
});

module.exports = router;
