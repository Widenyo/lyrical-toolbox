const { Router } = require("express");
const axios = require('axios')
const fs = require('fs')
const zl = require('zip-lib');
const router = Router()
let count = 0

router.get('/', async (req, res) => {
    const {url} = req.query
    console.log(count)

    try{
        count += 1
        const page = await axios.get(url)

        if(count % 2 !== 0){
        const imgUrls = page.data.split('<div class="container-chapter-reader">')[1].match(/<img [^>]*src="[^"]*"[^>]*>/gm).map(x => x.replace(/.*src="([^"]*)".*/, '$1'));
        imgUrls.pop()

        imgUrls.forEach(async(url, i) => {
            const image = await axios.get(url, {
                responseType: 'stream',
                headers:{
                    referer: "https://mangakakalot.com/"
                }
            })
        
            image.data.pipe(fs.createWriteStream(__dirname + "/../../public/asoplata/in/lol" + i + '.jpg'))
        })
        return res.send('DESCARGANDO PORQUERIAS. AHORA MANDO EL ZIP'); 
    }else{
        await zl.archiveFolder(__dirname + "/../../public/asoplata/in", __dirname + "/../../public/asoplata/out/lol.zip")
        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="almadeasoplata.zip"`,
            'Content-Type': 'application/zip',
          })
        var readStream = fs.createReadStream(__dirname + "/../../public/asoplata/out/lol.zip");
        fs.readdir(__dirname + "/../../public/asoplata/in", (err, files) => {
            if (err) throw err;
          
            for (const file of files) {
              if(file !== '.gitkeep')fs.unlink((__dirname + "/../../public/asoplata/in/" + file), err => {
                if (err) throw err;
              });
            }
          });
        readStream.pipe(res);
    }
    }catch(e){
        console.log(e)
        res.send(e)
    }

})

module.exports = router