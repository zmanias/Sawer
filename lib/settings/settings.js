// No Enc? Buy : 6283155619441
// Script By : Fandirr Store

const fs = require('fs')

global.storename = "Fandirr Store"
global.botname = "Fandirr Store"
global.namaowner = "Fandirr Store"
global.namabot = "RafatharBotz" 
global.namabot2 = "RafatharBotz"
global.ownername = "Fandirr Store"
global.owner = "6283155619441"

global.packname = "Fandirr Store"
global.footer2 = '© Fandirr Store'
global.author = "Sticker By Fandirr Store"
global.web = "https://whatsapp.com/channel/0029VaQyf2z8qIzvfeH80a1W"
global.wm = "Fandirr Store Version 3.0.3"
global.chjid = "120363318521671268"

global.sessionName = "session"
global.prefix = "."
global.botNumber = "6283155619441" 

global.sch = "https://whatsapp.com/channel/0029Vajny6c4tRs0qnwveJ0s"
global.sgc = "https://whatsapp.com/channel/0029Vajny6c4tRs0qnwveJ0s"
global.stg = "https://whatsapp.com/channel/0029Vajny6c4tRs0qnwveJ0s"
global.syt = "https://whatsapp.com/channel/0029Vajny6c4tRs0qnwveJ0s"
global.sig = "https://whatsapp.com/channel/0029Vajny6c4tRs0qnwveJ0s"
global.thumb = "https://telegra.ph/file/2324daab2ea7ce51596fa.jpg"

global.qris = "https://telegra.ph/file/9050d03a7fcc77026328f.jpg"
global.dana = "-"
global.gopay = "-"
global.ovo = "-"
global.pulsa = "-"
global.rekbni = "-"
global.qr = fs.readFileSync("./r/qr.jpg")

// saweria
global.mail = 'fandirrstore@gmail.com' // DAFTAR KE saweria.co yaa prenn
// setting gateway
global.rbuyscv1 = '25000' 
global.rbuyscv2 = '35000' 
global.rbuyscv3 = '45000' 
global.rbuyscv3up = '55000' 

// Apikey nya
global.gtds = "GataDios"
global.xyro = "5dRkJDWvIG"
global.nlkey = "AdpStore"
global.skizapi = "SanTampan"
global.neoxrapi = "sanolan"
global.ariekey = "DVMsILTHCnP2lTz8kqUIN7vjFQrnEMPg"

// Buat cpanel
global.domain = ""
global.apikey = ""
global.capikey = ""
global.domain2 = ""
global.apikey2 = ""
global.capikey2 = ""
global.eggs = "15"
global.locc = "1"
global.apido = "Api digital ocean"

global.autotyping = false
global.autoread = false
global.autobio = false
global.anticall = true
global.antispam = false
global.antibot = false
global.welcome = false // welcome+left

global.gamewaktu = 60
global.limit = 15
global.delayjpm = 5500

global.bejir = (a, b) => {
let bjir = 
{key: {remoteJid: 'status@broadcast', 
participant: '0@s.whatsapp.net'}, 
message: {orderMessage: {itemCount: 1000, 
status: 1, surface: 1, 
message: a, orderTitle: '', thumbnail: b, 
sellerJid: '0@s.whatsapp.net'}}};
return bjir
}

// NOTE
// true aktif & false nonaktif

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
