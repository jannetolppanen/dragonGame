// Pelikartta

const map = []

map[0] = "Vanha linnantorni"
map[1] = "Syvä kaivo"
map[2] = "Aurinkoinen metsäaukio"
map[3] = "Nukkuva lohikäärme"
map[4] = "Kapea metsäpolku"
map[5] = "Vanha portti"
map[6] = "Joen ranta"
map[7] = "Tyhjä puupenkki"
map[8] = "Vanha mökki, sisältä kuuluu hiljaista musiikkia"
map[9] = "Portti sulkeutuu takanasi ja uusi seikkailu odottaa sinua"


var mapLocation = 4

const images = []

images[0] = "torni.jpg"
images[1] = "kaivo.jpg"
images[2] = "aukio.jpg"
images[3] = "dragon.jpg"
images[4] = "polku.jpg"
images[5] = "portti.jpg"
images[6] = "joki.jpg"
images[7] = "penkki.jpg"
images[8] = "mokki.jpg"
images[9] = "new_adventure.jpg"

const blockMessage = []

blockMessage[0] = "Haluamasi reitti on liian vaarallinen"
blockMessage[1] = "Salaperäinen voima estää liikkumisen tuohon suuntaan"
blockMessage[2] = "Vaikeakulkuinen pusikko estää etenemisen"
blockMessage[3] = "Et pääse sitä kautta ohittamaan lohikäärmettä"
blockMessage[4] = ""
blockMessage[5] = "Portti sulkeutui" // Tähän voisi laittaa että portti sulkeutuu kuvassakin ja lopussa aukeaa kun peli on loppu
blockMessage[6] = "Joki on liian syvä ylitettäväksi"
blockMessage[7] = "Metsä on liian tiheä läpäistäväksi"
blockMessage[8] = "Olet liian peloissasi mennäksesi tuohon suuntaan"
blockMessage[9] = "Portti on sulkeutunut jälleen"


// Pelaajan syöte
let playersInput = ""

// Pelin viesti
let gameMessage = ""

// Suunta
let direction =""

// Esineet, lokaatiot, reppu, valittu esine, mökin kirkkaus, lohari hengissä
let items = ["huilu", "kivi", "miekka", "soihtu"]
let itemLocations = [1, 6, 8, 7]
let backPack = []
let knownItems = ["huilu", "kivi", "miekka", "soihtu"]
let item = ""
let cottageBrightness = 0.15
let dragonDead = false

// Pelaajan käytössä olevat toiminnot
const actionsForPlayer = ["pohjoinen", "itä", "etelä", "länsi", "poimi", "käytä", "pudota"]
let action = ""

// Kuuntelee napin painallusta. click tarkoittaa että kuuntelee klikkausta, sitten kutsuu clickHandler nimistä funktiota, falsesta en tiedä
const button = document.querySelector("#button")
button.addEventListener("click", clickHandler, false)

// Käyttöliittymä, kuva, käyttäjän syöte ja pelin output, nuolinäppäimet
const image = document.querySelector("img")
const input = document.querySelector("#input")
const output = document.querySelector("#output")
const arrow_up = document.querySelector("#up")
const arrow_left = document.querySelector("#left")
const arrow_down = document.querySelector("#down")
const arrow_right = document.querySelector("#right")

// Nuolenpainallukset
arrow_up.addEventListener("click", () => {
    direction = "pohjoinen"
    playGame()
})
arrow_left.addEventListener("click", () => {
    direction = "länsi"
    playGame()
})
arrow_down.addEventListener("click", () => {
    direction = "etelä"
    playGame()
})
arrow_right.addEventListener("click", () => {
    direction = "itä"
    playGame()
})

// Enterinpainalluskuuntelu
input.addEventListener("keypress", function(event) {
    // Jos painaa enteriä, painetaan #button ja tyhjennetään input kenttä
    if (event.key === "Enter") {
      document.getElementById("button").click();
      document.getElementById("input").value = ""
    }
  })



// Päivitä pelaajan sijainti
render()

function clickHandler() {
    playGame()
}

function playGame() {

    if(direction != "") {
        playersInput = direction
    } else {
        // Lue pelaajan syöte ja muuta se pieniksi kirjaimiksi
        playersInput = input.value.toLowerCase()
    }

    // Nollataan peliviesti ja action edellisiltä kierroksilta
    gameMessage = ""
    action = ""

    // Tarkastaa onko pelaajan antama käsky (itä, poimi...) actionsForPlayer arrayssa
    // käsky tallennetaan action muuttujaan
    for (let i = 0; i < actionsForPlayer.length; i++) {
        if (playersInput.indexOf(actionsForPlayer[i]) !== -1) {
            action = actionsForPlayer[i]
            direction = ""
            break
        }
    }
    // Tarkastaa onko pelaajan antama esine (huilu, kivi..) knownItems arrayssa
    // esine tallennetaan item muuttujaan
    for (i = 0; i < knownItems.length; i++) {
        if(playersInput.indexOf(knownItems[i]) !== -1) {
            item = knownItems[i]
        }
    }

    // Jos mapLocation 9, peli on läpi eikä takaisin pääse
    // mapLocation 5:ssä suunta itään pääsee jos lohikäärme on kuollut
    switch (action) {
        case "pohjoinen":
            if(mapLocation == 9) {
                gameMessage = blockMessage[9]
                break
            }
            if(mapLocation >= 3) {
            mapLocation -= 3
            } else {
                gameMessage = blockMessage[mapLocation]
            }
            break

        case "itä":
            if(mapLocation == 9) {
                gameMessage = blockMessage[9]
                break
            }
            if(mapLocation == 5 && dragonDead) {
                mapLocation = 9
                break
            }
            if(mapLocation % 3 !== 2){
            mapLocation += 1
            } else {
                gameMessage = blockMessage[mapLocation]
            }
            break

        case "etelä":
            if(mapLocation == 9) {
                gameMessage = blockMessage[9]
                break
            }
            if(mapLocation < 6) {
            mapLocation += 3
            } else {
                gameMessage = blockMessage[mapLocation]
            }
            break

        case "länsi":
            if(mapLocation == 9) {
                gameMessage = blockMessage[9]
                break
            }
            if(mapLocation % 3 !== 0) {
                mapLocation -=1
            } else {
            gameMessage = blockMessage[mapLocation]
        }
            break

        case "poimi":
            takeItem()
            break

        case "pudota":
            dropItem()
            break

        case "käytä":
            useItem()
            break

        default:
            gameMessage = "Tuntematon toiminto"
    }
    render()
}

function takeItem() {
    let itemIndexNumber = items.indexOf(item)

    // Jos itemi löytyy items listalta, indeksinumero talteen
    if(itemIndexNumber !== -1 && itemLocations[itemIndexNumber] === mapLocation) {      
        backPack.push(item) // Item reppuun
        items.splice(itemIndexNumber, 1) // indeksinumeron mukainen esine pois items listalta
        itemLocations.splice(itemIndexNumber, 1) // itemLocationsille sama
        gameMessage = "Poimit esineen " + item
    } else {
        gameMessage = 'Et voi tehdä tätä toimenpidettä'
    }
}

function dropItem() {
    // Tarkastetaan onko repussa esineitä
    if(backPack.length !== 0) {
        // Etsi repusta tekstikentässä mainitun esineen indeksi
        let backPackIndexNumber = backPack.indexOf(item)

        // Esine löytyi jos indeksi ei ole -1
        if(backPackIndexNumber !== -1) {
            // Kerro pelaajalle että esine on pudotettu
            gameMessage = 'Pudotit esineen: ' + item + '.'

            // Siirrä esine repusta peliympäristöön
            items.push(backPack[backPackIndexNumber])
            itemLocations.push(mapLocation)

            // Poista esine repusta
            backPack.splice(backPackIndexNumber, 1)
        } else {
            // Jos esinettä ei ole repussa
            gameMessage = 'Et voi tehdä tätä.'
        }
    } else {
        // Jos reppu on tyhjä
        gameMessage = 'Sinulla ei ole mitään mukana.'
    }

}

function useItem() {
    // Etsitään repusta halutun itemin indeksi
    let backPackIndexNumber = backPack.indexOf(item)

    // Jos itemille ei löydy indeksiä
    if(backPackIndexNumber === -1) {
        gameMessage = 'Sinulla ei ole sitä mukana'
    }
    // Onko reppu tyhjä
    if(backPack.length === 0) {
        gameMessage = 'Sinulla ei ole mitään mukana'
    }
    // Jos item löytyi repusta
    if(backPackIndexNumber !== -1) {
        switch(item) {
            case 'huilu':
                gameMessage = 'Kaunis musiikki kaikuu ympärilläsi'
                break
            
            case 'miekka':
                // Jos miekkaillaan lohikärmeksen ruudussa
                if(dragonDead) {
                    gameMessage = "Koitatko leikata lohikäärmeestä matkamuistoa?"
                    break
                }
                if(mapLocation === 3) {
                    gameMessage = 'Heilautat miekkaasi ja tapat lohikäärmeen'
                    dragonDead = true
                    map[3] = "Lohikäärmeen ruumis"
                    document.getElementById("3").innerHTML = "Lohikäärmeen ruumis"
                    addTr()
                } else {
                    gameMessage = 'Heiluttelet miekkaasi tylsistyneenä'
                }
                break

            case 'kivi':
                // Jos ollaan kaivolla
                if(mapLocation === 1) {
                    gameMessage = 'Pudotat kiven kaivoon'
                    backPack.splice(backPackIndexNumber, 1)
                } else {
                    gameMessage = 'Pyörittelet kiveä taskussasi'
                }
                break

            case 'soihtu':
                // Jos ollaan mökillä
                if(mapLocation === 8) {
                    cottageBrightness = 1
                    gameMessage = 'Soihdun avulla näet paremmin'
                } else {
                    gameMessage = 'Soihtu lämmittää mukavasti'
                }
        }
    }

}


function backPackPrint() {
    if(backPack.length != 0) {
        return "<h2>Repun sisältö:</h2><br><p>" + backPack.join(", ") + "</p>"
    } else {
        return "<h2>Repun sisältö:</h2><br><p>tyhjää täynnä...</p>"
    }
}

function render() {
    image.src = "images/" + images[mapLocation]
    // miniMap()
    checkDarkness()
    output.innerHTML = "<h2>Sijaintisi :</h2> <br> <p>" + map[mapLocation] +"</p>"
    // output.innerHTML += "<h2>Repun sisältö:</h2><br><p>" + backPack.items + "</p>"
    output.innerHTML += backPackPrint()
    output.innerHTML += "<br><em>" + gameMessage + "</em>"
    for(let i = 0; i < items.length; i++) {
        if(mapLocation === 8 && cottageBrightness < 1) {
            output.innerHTML += "<br> On kamalan pimeää, saisimpa jostain valoa"
            break
        }
        if(mapLocation === itemLocations[i]) {
            output.innerHTML += "<br> Näet esineen: <strong>" + items[i] +"</strong>"
        }
    }
    miniMap()
}

// Minimap, käy läpi minimapin id:t 0-8 ja vaihtaa värin jos on osuma, muuten vaihtaa värin takaisin normaaliksi
function miniMap() {
    for(let i=0; i<10; i++) {
        let mapSpot = document.getElementById(i)
        if(mapLocation != i) {
            mapSpot.style.backgroundColor = "#7fa6ad"
        }
        if(mapLocation == i) {
            mapSpot.style.backgroundColor = "#9dc3ac"
        }
    }
}

// Mökillä on pimeää kunnes siellä on sytytetty soihtu
function checkDarkness() {
    image.src = "images/" + images[mapLocation]
    if(mapLocation === 8) {
        image.style.filter = "brightness("+cottageBrightness+")"
    } else {
        image.style.filter = "brightness(1)"
    }
}

// Lisää uuden ruudun minimappiin kun lohari hengetön
function addTr() {
    const tr = document.getElementById("trPlus")
    const td = document.createElement("td")
    td.setAttribute("id", "9")
    td.innerHTML = "Uusi seikkailu"
    tr.appendChild(td)
}

