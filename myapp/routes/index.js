var express = require('express');

//var bodyParser = require('body-parser');
//var multer = require('multer');
//var upload = multer();
//var app = express();
var router = express.Router();

let landing = require('../controllers/landing');
//const express = require('express')

const multer = require('multer');
const upload = multer({dest: __dirname + '/../profile-pictures'}, {limits: {fileSize: 5000000 }},
	{filename: function(req, file, callback) {callback(null, file.filename);} });
/*
console.log("got here");

var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Z0pik$pim",
	database: "social_db"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});
*/






/* GET home page. */
//router.get('/', landing.form);

//app.set('view engine', 'pug');
//app.set('views', './views');

//app.use(express.static('public'));


/*
app.get('/', function(req, res){
   res.render('home');
});

*/

// for parsing application/json
//app.use(bodyParser.json());

// for parsing application/xwww-
// form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true}));

// for parsing multipart/form-data
//app.use(upload.array());
//app.use(express.static('public'));

//app.post('/', function(req, res){
//	console.log(req.body);
//	res.send('received your request!');
//})


//app.listen(3000);

//router.get('/test', landing.test);
//router.get('/', landing.home);
//router.get('/form', landing.get_form);
//router.post('/form', landing.post_form);

//router.get('/', landing.get_landing);
//router.post('/', landing.submit_lead);




router.get('/', landing.home);

router.get('/sign-in', landing.sessionChecker, landing.get_sign_in);
router.post('/sign-in', landing.post_sign_in);
//router.post('/sign-in-json', landing.post_sign_in_json)

router.get('/sign-up', landing.get_sign_up);
router.post('/sign-up', landing.post_sign_up);


router.post('/submit-picture', upload.single('file'), landing.submit_picture);

//router.get('/user', landing.get_username)
router.get('/logout', landing.logout);

//router.get('/sign_in')

router.get('/leaderboards', landing.leaderboards);
router.get('/play', landing.play);
router.post('/play', landing.play_post);


router.get('/user', landing.get_user);


router.get('/puzzle/:puzzle_name', landing.show_puzzle);

/*
router.get('/create-game', landing.get_create_game);
*/

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
//router.post('/play/:game_id/complete', landing.game_complete);

/*
router.get('/time-attack', landing.get_time_attack);
*/
//router.get('/create-game', landing.create_game);

//router.get('/user/:username', landing.show_user);
//router.get('/user/:username', landing.user_home);
//router.get('/form', landing.get_form);
//router.post('/form', landing.post_form);
module.exports = router;
