const buscador = document.getElementById('buscador')
const input = document.getElementById('urlinput')
const container = document.getElementById('container')

let id = 0




if(input.value !== ""){
    googleReverse(input.value)
}


buscador.addEventListener('submit', (e) => {
    e.preventDefault()
    googleReverse(e.target.url.value)
})


async function googleReverse(url){
    try{
    const data = await fetch('/utils/googlereverse/search?url=' + url)
    const imagenes = await data.json()

    container.innerHTML += `<br>
    <div>
        <img src='${url}'><br>
    `

    imagenes.forEach(i => {
        id += 1
        if(i.thumbnail){
        container.innerHTML += `
        <div class="search">
            <a href="javascript:void(0);" id="${id}" url=${i.thumbnail} onclick="getUrlAndSearch(${id} )"><img class="img" src="${i.thumbnail}"></a><br>
            <center><a class='ir' href="${i.link}" target="_blank">Ir</a></center>
        </div>
        `
        }
    })

    container.innerHTML += `
    </div>
    `

    }catch(e){
        console.log(e)
        return
    }
}

function getUrlAndSearch(id){
    const anchor = document.getElementById(id)
    const url = anchor.getAttribute('url')
    googleReverse(url)
}