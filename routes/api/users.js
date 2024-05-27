const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Post = require('../../schemas/PostSchema');
const User = require('../../schemas/UserSchema');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const dir = path.join(__dirname, '../../uploads/images');
      await fs.mkdir(dir, { recursive: true }); // Create directory if it does not exist
      cb(null, dir);
    } catch (error) {
      cb(error, dir);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: false }));

router.put('/:userId/follow', async (req, res, next) => {
  let userId = req.params.userId;

  let user = await User.findById(userId);

  if (user == null) return res.sendStatus(404);

  let isFollowing = user.followers?.includes(req.session.user._id);
  let option = isFollowing ? '$pull' : '$addToSet';

  req.session.user = await User.findByIdAndUpdate(
    req.session.user._id,
    { [option]: { following: userId } },
    { new: true }
  ).catch((error) => {
    console.log(error);
    res.sendStatus(400);
  });

  User.findByIdAndUpdate(userId, {
    [option]: { followers: req.session.user._id },
  }).catch((error) => {
    console.log(error);
    res.sendStatus(400);
  });

  res.status(200).send(req.session.user);
});

router.get('/:userId/following', async (req, res, next) => {
  User.findById(req.params.userId)
    .populate('following')
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get('/:userId/followers', async (req, res, next) => {
  User.findById(req.params.userId)
    .populate('followers')
    .then((results) => {
      res.status(200).send(results);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

// Route to upload profile picture
router.post(
  '/profilePicture',
  upload.single('croppedImage'),
  async (req, res, next) => {
    if (!req.file) {
      console.log('No file uploaded with ajax request.');
      return res.sendStatus(400);
    }

    const filePath = `/uploads/images/${req.file.filename}`;
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../../${filePath}`);

    try {
      await fs.rename(tempPath, targetPath); // Rename and move the file
      await fs.chmod(targetPath, 0o644); // Set file permissions to readable

      // Update user profile picture in the database
      req.session.user = await User.findByIdAndUpdate(
        req.session.user._id,
        { profilePic: filePath },
        { new: true }
      );
      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
