const {Router} = require('express');
const router = Router()
const fs = require('fs');
const ytdl = require('ytdl-core');
const youtubesearchapi = require('youtube-search-api')
const contentDisposition = require('content-disposition')
const ffmpeg = require('fluent-ffmpeg')

function validator(str) {
  return !/[^\u0000-\u00ff]/g.test(str);
}

function isYtUrl(str){
  return /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/.test(str)
}



router.get('/', async (req, res) => {

  return res.render('tomp3');
})

router.get('/download/:id', async (req, res) => {

    const {id} = req.params
    const {title, format} = req.query
    if(format !== 'mp3') return res.send('pone un formato valido SALAME')

    if(!title) return res.send(title + ' lol') 
    const mp3 = title.replace(/[\/\\.":*?<>{}|]/g, '') + `.${format}`

    

    
        try{
        await new Promise((resolve, reject) => {
            const download = ytdl('http://www.youtube.com/watch?v=' + id, {filter: 'audioonly'})
            const proc = new ffmpeg({source:download})
              proc.setFfmpegPath(process.env.FFMPEG_PATH)
              proc.withAudioCodec('libmp3lame')
              .toFormat(format)
              proc.saveToFile(`${__dirname}/../musica/${mp3}`, () => {
                console.log('guardando')
              })
              proc.on('error', (e) => reject(e))
              proc.on('end', () => resolve())
            })
        }catch(e){
          console.log(e)
          return res.send('ERROR XD')
        }


      var stat = fs.statSync(`${__dirname}/../musica/${mp3}`);
      var file = fs.readFileSync(`${__dirname}/../musica/${mp3}`, 'binary');
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'audio/mpeg');
      !validator(mp3) ?
      res.setHeader('Content-Disposition', `attachment; filename=${contentDisposition(mp3)}`):
      res.setHeader('Content-Disposition', `attachment; filename=\"${mp3}\"`);
      res.write(file, 'binary');
      res.end();

      

})

router.get('/downloadmp4/:id', async (req, res) => {

  const {id} = req.params
  const {title} = req.query

  if(!title) return res.send(title + ' lol') 

  const mp4 = title.replace(/[\/\\.":*?<>{}|]/g, '') + '.mp4'

  

  
      try{
      await new Promise((resolve, reject) => { // wait
          ytdl('http://www.youtube.com/watch?v=' + id)
          .on('error', e => reject(e))
          .pipe(fs.createWriteStream(`${__dirname}/../musica/${mp4}`))
          .on('close', () => {
            resolve();
          })
        })
      }catch(e){
        console.log(e)
        return res.send('ERROR XD')
      }


    var stat = fs.statSync(`${__dirname}/../musica/${mp4}`);
    var file = fs.readFileSync(`${__dirname}/../musica/${mp4}`, 'binary');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'audio/mpeg');
    !validator(mp4) ?
    res.setHeader('Content-Disposition', `attachment; filename=${contentDisposition(mp4)}`):
    res.setHeader('Content-Disposition', `attachment; filename=\"${mp4}\"`);
    res.write(file, 'binary');
    res.end();

    

})

router.get('/videosearch/:name', async (req, res) => {
  const {name} = req.params

    try{
      if(!isYtUrl(name)){
        const videosReq = await youtubesearchapi.GetListByKeyword(`${name}`)
        const videos = videosReq.items.map(v => {
          return({
            title: v.title,
            channel: v.channelTitle,
            id: v.id,
            thumbnail: v.thumbnail.thumbnails[0].url,
            length: v.length && v.length.simpleText
          })
        })
        res.send(videos)
      }else{
        const splitUrl = videos.split('watch?v=')
        const id = splitUrl[1]
        const videoReq = await youtubesearchapi.GetVideoDetails(id)
        console.log(videoReq)
        res.send([])
      }
      }catch(e){
        console.log(e)
        return res.send([])
      }
})



module.exports = router