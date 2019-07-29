const router = require('express').Router()
const multer = require('multer')
const mime = require('mime')

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, __dirname + '/public/uploads')
	},
	filename: function(req, file, cb) {
		console.log(file)
		cb(
			null,
			file.originalname
				.split(' ')
				.join('_')
				.split(' ')
				.join('_') +
				'_' +
				Date.now() +
				'.' +
				mime.getExtension(file.mimetype)
		)
	}
})

const upload = multer({ storage: storage })

// ---

router.get('/', (req, res) => {
	res.render('index')
})

router.post('/api/upload', upload.single('file'), (req, res, next) => {
	res.json({ file: '/files/' + req.file.filename })
})

module.exports = router
