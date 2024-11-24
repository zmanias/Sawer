require("./lib/settings/settings")

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, getAggregateVotesInPollMessage, proto } = require("@whiskeysockets/baileys")
const fs = require('fs')
const pino = require('pino')
const chalk = require('chalk')
const path = require('path')
const axios = require('axios')
const FileType = require('file-type')
const readline = require("readline");
const yargs = require('yargs/yargs')
const lodash = require('lodash')
const { Boom } = require('@hapi/boom')
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, imageToWebp3, videoToWebp, writeExifImg, writeExifImgAV, writeExifVid } = require('./lib/general/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/general/myfunc2')

let session = `${sessionName}`
let usePairingCode = true;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

global.db = JSON.parse(fs.readFileSync('./data/rafatharcode-db/database.json'))
if (global.db) global.db.data = {
users: {},
chats: {},
others: {},
settings: {},
...(global.db.data || {})
}

async function connectToWhatsApp() {
    const sessionPath = `./${sessionName}`;
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const rafatharcode = makeWASocket({
        logger: pino({ level: "silent" }),
        printQRInTerminal: !usePairingCode,
        auth: state,
        browser: ["Ubuntu", "Chrome", "91.0.4472.124"],
        generateHighQualityLinkPreview: true,
    })
    
    rafatharcode.ev.on('creds.update', saveCreds);

if (usePairingCode && !rafatharcode.authState.creds.registered) {
console.log('Masukan nomor yang aktif')
const phoneNumber = await question('Nomor: ')
const code = await rafatharcode.requestPairingCode(phoneNumber.trim())
console.log(`Kode pairing: ${code}`);
}

store.bind(rafatharcode.ev)

rafatharcode.ev.on('call', async (celled) => {
let botNumber = await rafatharcode.decodeJid(rafatharcode.user.id)
let lol = anticall
if (!lol) return
console.log(celled)
for (let loli of celled) {
if (loli.isGroup == false) {
if (loli.status == "offer") {
let nomer = await rafatharcode.sendTextWithMentions(loli.from, `*${global.wm}* Tidak menerima panggilan ${loli.isVideo ? `vidio!` : `suara!`}`)
}}}
})

rafatharcode.ev.on('messages.upsert', async (chatUpdate) => {
try {
for (let mek of chatUpdate.messages) {
if (!mek.message) return;
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
if (mek.key && mek.key.remoteJid === 'status@broadcast') return;
const m = smsg(rafatharcode, mek, store);
require("./rafatharcode")(rafatharcode, m, chatUpdate, mek, store);
}} catch (err) {
console.log(err);
}
});

rafatharcode.ev.on('messages.upsert', async chatUpdate => {
try {
//mek = chatUpdate.messages[0]
for (let mek of chatUpdate.messages) {
if (!mek.message) return
if (mek.mtype == 'interactiveResponseMessage') {
const command = mek.msg.body.text
console.log(command)
if (command == undefined) return
const comand = `.${command}`
rafatharcode.appenTextMessage(comand, chatUpdate)
}
}
} catch (err) {
console.log(err)
}
})

rafatharcode.ev.on('group-participants.update', async (anu) => {
if (!global.welcome) return
let botNumber = await rafatharcode.decodeJid(rafatharcode.user.id)
if (anu.participants.includes(botNumber)) return
try {
let metadata = await rafatharcode.groupMetadata(anu.id)
let namagc = metadata.subject
let participants = anu.participants
for (let num of participants) {
let check = anu.author !== num && anu.author.length > 1
let tag = check ? [anu.author, num] : [num]
if (anu.action == 'add') {
rafatharcode.sendMessage(anu.id, {text: check ? `@${anu.author.split("@")[0]} has added @${num.split("@")[0]} into this group` : `Welcome @${num.split("@")[0]} 🎉`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: {thumbnailUrl: '', title: '© Welcome Message', body: '', renderLargerThumbnail: false, sourceUrl: syt, mediaType: ''}}})
} 
if (anu.action == 'remove') { 
rafatharcode.sendMessage(anu.id, {text: check ? `@${anu.author.split("@")[0]} has issued @${num.split("@")[0]} from this group` : `@${num.split("@")[0]} leave this group`, 
contextInfo: {mentionedJid: [...tag], externalAdReply: {thumbnailUrl: '', title: '© Leaving Message', body: '', renderLargerThumbnail: false, sourceUrl: syt, mediaType: ''}}})
}} 
} catch (err) {
console.log(err)
}})

rafatharcode.ev.process(async (events) => {
if (events['presence.update']) {
await rafatharcode.sendPresenceUpdate('available');
}
if (events['messages.upsert']) {
const upsert = events['messages.upsert'];
for (let msg of upsert.messages) {
if (msg.key.remoteJid === 'status@broadcast') {
if (msg.message?.protocolMessage) return;
await sleep(3000);
await rafatharcode.readMessages([msg.key]);
}}}
if (events['creds.update']) {
await saveCreds();
}
});

rafatharcode.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

rafatharcode.ev.on('contacts.update', update => {
for (let contact of update) {
let id = rafatharcode.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

rafatharcode.getName = (jid, withoutContact = false) => {
id = rafatharcode.decodeJid(jid)
withoutContact = rafatharcode.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = rafatharcode.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === rafatharcode.decodeJid(rafatharcode.user.id) ?
rafatharcode.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

rafatharcode.sendContact = async (jid, kon, quoted = '', opts = {}) => {
let list = []
for (let i of kon) {
list.push({
displayName: await rafatharcode.getName(i + '@s.whatsapp.net'),
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await rafatharcode.getName(i + '@s.whatsapp.net')}\nFN:${await rafatharcode.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:lexcalhelp@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://bit.ly/420u6GX\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
})
}
rafatharcode.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
}

rafatharcode.setStatus = (status) => {
rafatharcode.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
return status
}

rafatharcode.public = true
rafatharcode.serializeM = (m) => smsg(rafatharcode, m, store)

rafatharcode.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
let type = await rafatharcode.getFile(path, true)
let {
res,
data: file,
filename: pathFile
} = type
if (res && res.status !== 200 || file.length <= 65536) {
try {
throw {
json: JSON.parse(file.toString())
}
}
catch (e) {
if (e.json) throw e.json
}
}
let opt = {
filename
}
if (quoted) opt.quoted = quoted
if (!type) options.asDocument = true
let mtype = '',
mimetype = type.mime,
convert
if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
else if (/video/.test(type.mime)) mtype = 'video'
else if (/audio/.test(type.mime))(
convert = await toAudio(file, type.ext),
file = convert.data,
pathFile = convert.filename,
mtype = 'audio',
mimetype = 'audio/ogg; codecs=opus'
)
else mtype = 'document'
if (options.asDocument) mtype = 'document'

delete options.asSticker
delete options.asLocation
delete options.asVideo
delete options.asDocument
delete options.asImage

let message = {
...options,
caption,
ptt,
[mtype]: {
url: pathFile
},
mimetype,
fileName: filename || pathFile.split('/').pop()
}
let m
try {
 m = await rafatharcode.sendMessage(jid, message, {
...opt,
...options
})
}
catch (e) {
//console.error(e)
m = null
}
finally {
if (!m) m = await rafatharcode.sendMessage(jid, {
...message,
[mtype]: file
}, {
...opt,
...options
})
file = null
return m
}
}

rafatharcode.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
let mime = '';
let res = await axios.head(url)
mime = res.headers['content-type']
if (mime.split("/")[1] === "gif") {
return rafatharcode.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
}
let type = mime.split("/")[0]+"Message"
if (mime === "application/pdf"){
return rafatharcode.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
}
if (mime.split("/")[0] === "image"){
return rafatharcode.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
}
if (mime.split("/")[0] === "video"){
return rafatharcode.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
}
if (mime.split("/")[0] === "audio"){
return rafatharcode.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
}
}

rafatharcode.sendTextWithMentions = async (jid, text, quoted, options = {}) => rafatharcode.sendMessage(jid, { text: text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })

rafatharcode.getFile = async (PATH, returnAsFilename) => {
let res, filename
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'
}
if (data && returnAsFilename && !filename)(filename = path.join(__dirname, './lib/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
return {
res,
filename,
...type,
data
}}

rafatharcode.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await rafatharcode.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

rafatharcode.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
let trueFileName = attachExtension ? ('./lib/' + filename + '.' + type.ext) : './lib/' + filename
// save to file
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

rafatharcode.sendStickerFromUrl = async(from, PATH, quoted, options = {}) => {
let { writeExif } = require('./lib/general/sticker')
let types = await rafatharcode.getFile(PATH, true)
let { filename, size, ext, mime, data } = types
let type = '', mimetype = mime, pathFile = filename
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : '', author: options.author ? options.author : author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
await rafatharcode.sendMessage(from, {sticker: {url: pathFile}}, {quoted})
return fs.promises.unlink(pathFile)
}

rafatharcode.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}

return buffer
} 
 
rafatharcode.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await rafatharcode.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
}

rafatharcode.sendVideo = async (jid, path, gif = false, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await rafatharcode.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
}

rafatharcode.sendImageAsSticker = async(jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await global.getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await rafatharcode.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

rafatharcode.sendVideoAsSticker = async(jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await global.getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await rafatharcode.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

rafatharcode.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await rafatharcode.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }
}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'
}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await rafatharcode.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)
}

rafatharcode.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}}

let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await rafatharcode.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })
return waMessage
}

rafatharcode.imgToSticker = async(from, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetchBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await rafatharcode.sendMessage(from, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

rafatharcode.vidToSticker = async(from, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetchBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await rafatharcode.sendMessage(from, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

rafatharcode.sendText = (jid, text, quoted = '', options) => rafatharcode.sendMessage(jid, { text: text, ...options }, { quoted, ...options })

rafatharcode.cMod = (jid, copy, text = '', sender = rafatharcode.user.id, options = {}) => {
//let copy = message.toJSON()
let mtype = Object.keys(copy.message)[0]
let isEphemeral = mtype === 'ephemeralMessage'
if (isEphemeral) {
mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
}
let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
let content = msg[mtype]
if (typeof content === 'string') msg[mtype] = text || content
else if (content.caption) content.caption = text || content.caption
else if (content.text) content.text = text || content.text
if (typeof content !== 'string') msg[mtype] = {
...content,
...options
}
if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
copy.key.remoteJid = jid
copy.key.fromMe = sender === rafatharcode.user.id

return proto.WebMessageInfo.fromObject(copy)
}

const { spinner, getGlobalSpinner, start, info, success, close } = require('./lib/general/spinner')

rafatharcode.ev.on("connection.update", async (update) => {
const { connection, lastDisconnect } = update;
if (connection === "close") {
  let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
  if (reason === DisconnectReason.badSession) {
console.log(`Bad Session File, Please Delete Session and Scan Again`);
process.exit();
  } else if (reason === DisconnectReason.connectionClosed) {
console.log("Connection closed, reconnecting....");
connectToWhatsApp();
  } else if (reason === DisconnectReason.connectionLost) {
console.log("Connection Lost from Server, reconnecting...");
connectToWhatsApp();
  } else if (reason === DisconnectReason.connectionReplaced) {
console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
process.exit();
  } else if (reason === DisconnectReason.loggedOut) {
console.log(`Device Logged Out, Please Delete Folder Session yusril and Scan Again.`);
process.exit();
  } else if (reason === DisconnectReason.restartRequired) {
console.log("Restart Required, Restarting...");
connectToWhatsApp();
  } else if (reason === DisconnectReason.timedOut) {
console.log("Connection TimedOut, Reconnecting...");
connectToWhatsApp();
  } else {
console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
connectToWhatsApp();
  }
} else if (connection === "connecting") {
start(`1`, `Menghubungkan Koneksi...`)
} else if (connection === "open") {
success(`1`, `Berhasil Terhubung Ke WhatsApp`)
}
});
return rafatharcode
rl.close();
}

connectToWhatsApp()
process.on("uncaughtException", console.error);

let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})