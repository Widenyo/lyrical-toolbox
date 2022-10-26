const {Router} = require('express')
const router = Router()

const asoplataRouter = require('./asoplata')
const converterRouter = require('./tomp3')
const txtRouter = require('./txt')
const reverseRouter = require('./saucenreverse/saucenreverse.router')

router.use('/asoplata', asoplataRouter)
router.use('/converter', converterRouter)
router.use('/3x3', txtRouter)
router.use('/reverse', reverseRouter)

router.get('/', (req, res) => {
    res.render('index')
})


module.exports = router