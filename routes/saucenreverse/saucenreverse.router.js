const {Router} = require('express')
const router = Router()

router.get('/', (req, res) => {
    let url = ""
    if(req.query.url) url = req.query.url

    res.render("reverseimgsearch.ejs", {url:url})
})

router.use('/sauce', require('./saucenao'))
router.use('/google', require('./googlereverse'))

module.exports = router