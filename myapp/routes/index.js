var express = require('express');
var router = express.Router();
let landing = require('../controllers/landing');
const multer = require('multer');
const upload = multer({dest: __dirname + '/../profile-pictures'}, {limits: {fileSize: 5000000 }},
	{filename: function(req, file, callback) {callback(null, file.filename);} });


router.get('/', landing.home);

router.get('/sign-in', landing.sessionChecker, landing.get_sign_in);
router.post('/sign-in', landing.post_sign_in);


router.get('/sign-up', landing.get_sign_up);
router.post('/sign-up', landing.post_sign_up);


router.post('/submit-picture', upload.single('file'), landing.submit_picture);

router.get('/logout', landing.logout);

router.get('/leaderboards', landing.leaderboards);
router.get('/play', landing.play);


router.get('/user', landing.get_user);


router.get('/puzzle/:puzzle_name', landing.show_puzzle);


router.get('/puzzle/:puzzle_name/:username', landing.get_work_on);
router.post('/puzzle/:puzzle_name/:username', landing.run_code);



router.post('/puzzle/:puzzle_name/:username/submit', landing.work_on_submit);



router.post('/verify-user', landing.verify_user);

router.post('/play/time-attack', landing.create_time_attack);
router.get('/play/time-attack/:game_id', landing.get_time_attack);
router.post('/play/time-attack/:game_id', landing.run_code);
router.post('/play/time-attack/:game_id/submit', landing.game_submit);
router.post('/play/time-attack/:game_id/complete', landing.time_attack_complete)



router.get('/play/:game_id', landing.get_game);
router.post('/play/:game_id', landing.run_code);
router.post('/play/:game_id/submit', landing.game_submit);
router.get('/play/:game_id/terminated', landing.get_terminated);



module.exports = router;
