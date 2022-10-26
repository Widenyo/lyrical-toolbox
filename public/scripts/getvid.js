const buscarInput = document.getElementById('buscarInput')
const buscar = document.getElementById('buscar')
const videoContainer = document.getElementById('videoContainer')

async function buscarVideos(){
    const dataReq = await fetch(`/converter/videosearch/${buscarInput.value}`)
    const data = await dataReq.json()
    let videosHTML = ''
    data.forEach((v, i)  => {
        if(typeof v.channel !== 'undefined'){
        videosHTML += `
        <div class="video" id=${i}>
        <h2>${v.title}</h2>
        <h5>${v.channel}</h5>
        <a href="https://www.youtube.com/watch?v=${v.id}" target="_blank">Youtube</a><br>
        Duracion: ${v.length}<br>
        <a id="${i}__click" url="${v.thumbnail}" onclick=sauceNAO(${i}) href="javascript:void(0);"><img src="${v.thumbnail}" class='vidimg'><br></a>
        <a class="descarga" target="_blank" href='/converter/download/${v.id}?title=${v.title.replace(/[\/\\.":*?<>{}|#]/g, '')}&format=mp3'>Descargar MP3</a><br>
        <a class="descarga" target="_blank" href='/converter/downloadmp4/${v.id}?title=${v.title.replace(/[\/\\.":*?<>{}|#]/g, '')}'>  Descargar MP4</a>
        <div id="${i}__saucenao"></div>
        <br>
        </div>
        `
        }
    })
    videoContainer.innerHTML = videosHTML
}



buscar.addEventListener('click', async () => {
    buscarVideos()
})

async function sauceNAO(id){

    const anchor = document.getElementById(id+'__click')
    const div = document.getElementById(`${id}__saucenao`)
    const url = (anchor.getAttribute('url'))

    const dataReq = await fetch(`/saucenao/search/?url=${url}`)
    const data = await dataReq.json()
    console.log(data)
    let HTML = ""
    for(let i = 0; i < data.length; i++){
        HTML += `
        <div class="sauce">
        ${data[i].material}: ${data[i].characters}.<br>
        By: ${data[i].creator}.<br>
        Similarity: ${data[i].similarity}<br>
        `

        data[i].urls && data[i].urls.forEach(u =>{
            HTML += `<a target="_blank" href="${u}">Ver</a><br>`
        })

        HTML += `</div>`
    }

    div.innerHTML = HTML

}

buscarInput.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      buscarVideos()
    }
  });