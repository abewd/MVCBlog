const { post } = require("./comment-routes");

const router = require("express".router());
// TODO: REQUIRE MODELS
const { Post, User, Comment } = require();
// TODO: REQUIRE  UTILS, AUTH
const withAuth = require();

// Find all the users
router.get("/", (req, res) => {
  Post.findAll({
    // retrieve all this data from the writer
    attributes: ["id", "title", "body", "created_at"],
    // display in this format
    order: [["created_at", "DESC"]],
    include: [
      {
        //
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    // store data in postData as a json
    .then((postData) => res.json(postData))
    .catch((err) => {
      // otherwise display error
      console.log(err);
      res.status(500).json(err);
    });
});

// get the post by its ID

router.get("/:id", (req, res) => {
  Post.findOne({
    where: {
      // request the posters id
      id: req.params.id,
    },
    attributes: ["id", "title", "body", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    // if you cannot find a username related to the post via the search function
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      // convert data
      res.json(postData);
    })
    // display error message in case of server-side error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Make a post

router.post("/", withAuth, (req, res) => {
  Post.create({
    // request title
    title: req.body.title,
    // request body
    body: req.body.body,
    // request user id
    user_id: req.session.user_id,
  })
    // and then the data will be converted to json (the post)
    .then((postData) => res.json(postData))
    // error incase of serverside issue
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Update the post

router.put("/:id", withAuth, (req, res) => {
  Post.update(
    // update the body and title, all other elements remain the same
    {
      title: req.body.title,
      body: req.body.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((postData) => {
      // if the data is empty then display an error message
      if (!postData) {
        res.status(404).json({ message: "no post with this ID" });
        return;
      }
      res.json(postData);
    })
    // in case of serverside error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Delete a post

router.delete("/:id", withAuth, (req, res) => {
  // request post ID
  console.log("id", req.params.id);
  // destroy the post
  Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    // if the input is empty
    .then((postData) => {
      if (!postData) {
        res.status(404).json({ message: "no post with this ID" });
        return;
      }
      res.json(postData);
    })
    // in case of serverside error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
