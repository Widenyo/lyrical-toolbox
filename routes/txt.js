const { Router } = require("express");
const router = Router()
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas')

async function generateAndSend3x3(images, res){
  const canvas = createCanvas(702, 1005)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let x = 3
    let y = 3
    let placed = 0

    for(let i = 0; i < images.length; i++){
      const pic = await loadImage(images[i]);
      ctx.drawImage(pic, x, y, 230, 331);
      placed += 1
      if(placed % 3 === 0){
        y += 334
        x = 3
      }
      else x += 233
    }
    return res.send({image: canvas.toDataURL()})
}

router.get('/', (req, res) => {
  res.render('3x3')
})

router.get('/gen/:user', async (req, res) => {

    const { user } = req.params
    const {plat} = req.query

    if(plat === 'lastfm'){
      const query = `https://ws.audioscrobbler.com/2.0/?method=library.getartists&api_key=a38102a858a145c66fc1817e0d009ff8&user=${user}&format=json&limit=9`
      try{
      const resp = await axios.get(query)
      const artists = resp.data.artists.artist
      let images = []
      for(let i = 0; i < artists.length; i++){
        const url = artists[i].url
        const artistPageReq = await axios.get(url)
        const div = artistPageReq.data
        try{
        const image = div.split('class="header-new-background"')[1].split("</div>")[0].split('content="')[1].split('"')[0]
        images.push(image)
        }catch(e){
          images.push('https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png')
        }
      }
      return await generateAndSend3x3(images, res)
      }catch(e){
        return res.send('ERROR XD')
      }
    }


    const favQuery = () => { 
        return `
    query{
        User(name:"${user}"){
            favourites{
              anime{
                        nodes {
                  coverImage {
                    extraLarge
                  }
                  title{
                    romaji
                  }
                        }
              }
            }
          }
    }
    `
    }

    let anilistReq = {}

    try{
    anilistReq = await axios.post('https://graphql.anilist.co', {
        query: favQuery()
    })
    }catch(e){
        return res.status(401).send({Error: 'Ese user no existe'})
    }

    const favs = (anilistReq.data.data.User.favourites.anime.nodes).sort(() => Math.random() - 0.5)
    if(favs.length < 9 ){
        const remaining = 9 - favs.length
        let page = 1

        let query = (page) => { return `
        query{
            Page(page: ${page}){
              pageInfo{
                hasNextPage
              }
                mediaList(userName: "${user}", sort: SCORE) {
                    media{
                  coverImage {
                    extraLarge
                  }
                  title{
                    romaji
                  }
                  }
                }
              }
            }
        `};

        let list = []
        let hasNextPage = false

        try{
          const req = await axios.post('https://graphql.anilist.co', {
              query: query(page)
          })
          list = [...list, ...req.data.data.Page.mediaList]
          if(req.data.data.Page.pageInfo.hasNextPage) hasNextPage = true
          while(hasNextPage){
            page++

            const req = await axios.post('https://graphql.anilist.co', {
              query: query(page)
          })
          list = [...list, ...req.data.data.Page.mediaList]
          if(!req.data.data.Page.pageInfo.hasNextPage) hasNextPage = false

          }
          for(let i = list.length-1; i >= list.length-remaining; i--){
            if(!list[i]) return res.status(401).send({Error: "falta calle"})
            favs.forEach(f => {
              if(f.title.romaji === list[i].media.title.romaji){
                list.splice(i, 1)
                return i = list.length-1
              }
            })
            favs.push({...(list[i].media)})
        }
    }catch(e){
        console.log(e)
        return res.send(e)
    }
      

    }


    let slicedFav = favs.slice(0, 9)
    let images = []
    for(let i = 0; i < slicedFav.length; i++){
      images.push(slicedFav[i].coverImage.extraLarge)
    }


    return await generateAndSend3x3(images, res)
})

module.exports = router