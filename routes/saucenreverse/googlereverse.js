const {Router} = require('express')
const router = Router()
const axios = require('axios')

router.get('/', async (req, res) => {
    const {url} = req.query
    try{
    const reverseGooglereq = await axios.get('https://serpapi.com/search?engine=google_reverse_image&api_key=56c504037c5fd56d960455fc2bbd1d72009ab0c2d9ec3d9b13bbe632e7f77889&image_url=' + url)
    if(reverseGooglereq.data.image_results < 0) return res.send({Error: 'LOL'})
    const reverseGoogleInl = reverseGooglereq.data.inline_images ? reverseGooglereq.data.inline_images.map(i => {
        return(
            {
                link: i.link,
                thumbnail: i.thumbnail ? i.thumbnail : null
            }
        )
    })
    : []

    const reverseGoogleRes = reverseGooglereq.data.image_results.map(i => {
        return(
            {
                link: i.link,
                thumbnail: i.thumbnail ? i.thumbnail : null
            }
        )
    })

    return res.send([...reverseGoogleInl, ...reverseGoogleRes])
    }
    catch(e){
        console.log(e)
        return res.send({Error: 'LOL'})
    }
})


module.exports = router