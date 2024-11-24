const fs = require('fs')
const { tmpdir } = require("os")
const ff = require('fluent-ffmpeg')
const webp = require("node-webpmux")
const path = require("path")

const makeid = (length) => {
let result = '';
let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let charactersLength = characters.length;
for (let i = 0; i < length; i++) {
result += characters.charAt(Math.floor(Math.random() *
charactersLength));
}
return result;
}

async function imageToWebp (media) {

const tmpFileOut = path.join(tmpdir(), `${makeid(10)}.webp`)
const tmpFileIn = path.join(tmpdir(), `${makeid(10)}.jpg`)

fs.writeFileSync(tmpFileIn, media)

await new Promise((resolve, reject) => {
ff(tmpFileIn)
.on("error", reject)
.on("end", () => resolve(true))
.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`]).toFormat('webp').save(tmpFileOut)
//.addOutputOptions([
//"-vcodec",
//"libwebp",
//"-vf",
//"scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
//])
//.toFormat("webp")
//.save(tmpFileOut)
})

const buff = fs.readFileSync(tmpFileOut)
fs.unlinkSync(tmpFileOut)
fs.unlinkSync(tmpFileIn)
return buff
}

async function videoToWebp (media) {

const tmpFileOut = path.join(tmpdir(), `${makeid(10)}.webp`)
const tmpFileIn = path.join(tmpdir(), `${makeid(10)}.mp4`)

fs.writeFileSync(tmpFileIn, media)

await new Promise((resolve, reject) => {
ff(tmpFileIn)
.on("error", reject)
.on("end", () => resolve(true))
.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale=512:512:force_original_aspect_ratio=increase,fps=15,crop=512:512`]).toFormat('webp').save(tmpFileOut)
//.addOutputOptions([
//"-vcodec",
//"libwebp",
//"-vf",
//"scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
//"-loop",
//"0",
//"-ss",
//"00:00:00",
//"-t",
//"00:00:05",
//"-preset",
//"default",
//"-an",
//"-vsync",
//"0"
//])
//.toFormat("webp")
//.save(tmpFileOut)
})

const buff = fs.readFileSync(tmpFileOut)
fs.unlinkSync(tmpFileOut)
fs.unlinkSync(tmpFileIn)
return buff
}

async function writeExifImg (media, metadata) {
let wMedia = await imageToWebp(media)
const tmpFileIn = path.join(tmpdir(), `${makeid(10)}.webp`)
const tmpFileOut = path.join(tmpdir(), `${makeid(10)}.webp`)
fs.writeFileSync(tmpFileIn, wMedia)

if (metadata.packname || metadata.author) {
const img = new webp.Image()
const json = { "sticker-pack-id": `https://github.com/Jabalsurya2105`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
const exif = Buffer.concat([exifAttr, jsonBuff])
exif.writeUIntLE(jsonBuff.length, 14, 4)
await img.load(tmpFileIn)
fs.unlinkSync(tmpFileIn)
img.exif = exif
await img.save(tmpFileOut)
return tmpFileOut
}
}

async function writeExifVid (media, metadata) {
let wMedia = await videoToWebp(media)
const tmpFileIn = path.join(tmpdir(), `${makeid(10)}.webp`)
const tmpFileOut = path.join(tmpdir(), `${makeid(10)}.webp`)
fs.writeFileSync(tmpFileIn, wMedia)

if (metadata.packname || metadata.author) {
const img = new webp.Image()
const json = { "sticker-pack-id": `https://github.com/Jabalsurya2105`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
const exif = Buffer.concat([exifAttr, jsonBuff])
exif.writeUIntLE(jsonBuff.length, 14, 4)
await img.load(tmpFileIn)
fs.unlinkSync(tmpFileIn)
img.exif = exif
await img.save(tmpFileOut)
return tmpFileOut
}
}

async function writeExif (media, metadata) {
let wMedia = /webp/.test(media.mimetype) ? media.data : /image/.test(media.mimetype) ? await imageToWebp(media.data) : /video/.test(media.mimetype) ? await videoToWebp(media.data) : ""
const tmpFileIn = path.join(tmpdir(), `${makeid(10)}.webp`)
const tmpFileOut = path.join(tmpdir(), `${makeid(10)}.webp`)
fs.writeFileSync(tmpFileIn, wMedia)

if (metadata.packname || metadata.author) {
const img = new webp.Image()
const json = { "sticker-pack-id": `https://github.com/Jabalsurya2105`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }
const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")
const exif = Buffer.concat([exifAttr, jsonBuff])
exif.writeUIntLE(jsonBuff.length, 14, 4)
await img.load(tmpFileIn)
fs.unlinkSync(tmpFileIn)
img.exif = exif
await img.save(tmpFileOut)
return tmpFileOut
}
}

const tmp = path.join(__dirname, '../tmp')
/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
function sticker2(img, url) {
  return new Promise(async (resolve, reject) => {
    try {
      if (url) {
        let res = await fetch(url)
        if (res.status !== 200) throw await res.text()
        img = await res.buffer()
      }
      let inp = path.join(tmp, +new Date + '.jpeg')
      await fs.promises.writeFile(inp, img)
      let ff = spawn('ffmpeg', [
        '-y',
        '-i', inp,
        '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1',
        '-f', 'png',
        '-'
      ])
      ff.on('error', reject)
      ff.on('close', async () => {
        await fs.promises.unlink(inp)
      })
      let bufs = []
      const [_spawnprocess, ..._spawnargs] = [...(module.exports.support.gm ? ['gm'] : module.exports.magick ? ['magick'] : []), 'convert', 'png:-', 'webp:-']
      let im = spawn(_spawnprocess, _spawnargs)
      im.on('error', e => conn.reply(m.chat, util.format(e), m))
      im.stdout.on('data', chunk => bufs.push(chunk))
      ff.stdout.pipe(im.stdin)
      im.on('exit', () => {
        resolve(Buffer.concat(bufs))
      })
    } catch (e) {
      reject(e)
    }
  })
}

async function canvas(code, type = 'png', quality = 0.92) {
  let res = await fetch('https://nurutomo.herokuapp.com/api/canvas?' + queryURL({
    type,
    quality
  }), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Content-Length': code.length
    },
    body: code
  })
  let image = await res.buffer()
  return image
}

function queryURL(queries) {
  return new URLSearchParams(Object.entries(queries))
}

/**
 * Image to Sticker
 * @param {Buffer} img Image Buffer
 * @param {String} url Image URL
 */
async function sticker1(img, url) {
  url = url ? url : await uploadImage(img)
  let {
    mime
  } = url ? { mime: 'image/jpeg' } : await fromBuffer(img)
  let sc = `let im = await loadImg('data:${mime};base64,'+(await window.loadToDataURI('${url}')))
c.width = c.height = 512
let max = Math.max(im.width, im.height)
let w = 512 * im.width / max
let h = 512 * im.height / max
ctx.drawImage(im, 256 - w / 2, 256 - h / 2, w, h)
`
  return await canvas(sc, 'webp')
}

/**
 * Image/Video to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 * @param {String} packname EXIF Packname
 * @param {String} author EXIF Author
 */
async function sticker3(img, url, packname, author) {
  url = url ? url : await uploadFile(img)
  let res = await fetch('https://api.xteam.xyz/sticker/wm?' + new URLSearchParams(Object.entries({
    url,
    packname,
    author
  })))
  return await res.buffer()
}

/**
 * Image to Sticker
 * @param {Buffer} img Image/Video Buffer
 * @param {String} url Image/Video URL
 */
async function sticker4(img, url) {
  if (url) {
    let res = await fetch(url)
    if (res.status !== 200) throw await res.text()
    img = await res.buffer()
  }
  return await ffmpeg(img, [
    '-vf', 'scale=512:512:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1'
  ], 'jpeg', 'webp')
}


async function sticker5(img, url, packname, author, categories = ['']) {
  const WSF = require('wa-sticker-formatter')
  const stickerMetadata = {
    type: 'full',
    pack: packname,
    author,
    categories,
  }
  return await new WSF.Sticker(img ? img : url, stickerMetadata).build()
}


/**
 * Add WhatsApp JSON Exif Metadata
 * Taken from https://github.com/pedroslopez/whatsapp-web.js/pull/527/files
 * @param {Buffer} webpSticker 
 * @param {String} packname 
 * @param {String} author 
 * @param {String} categories 
 * @param {Object} extra 
 * @returns 
 */
async function addExif(webpSticker, packname, author, categories = [''], extra = {}) {
  const webp = require('node-webpmux') // Optional Feature
  const img = new webp.Image();
  const stickerPackId = crypto.randomBytes(32).toString('hex');
  const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': packname, 'sticker-pack-publisher': author, 'emojis': categories, ...extra };
  let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00]);
  let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8');
  let exif = Buffer.concat([exifAttr, jsonBuffer]);
  exif.writeUIntLE(jsonBuffer.length, 14, 4);
  await img.loadBuffer(webpSticker)
  img.exif = exif
  return await img.saveBuffer()
}

module.exports = {
  /**
   * Image/Video to Sticker
   * @param {Buffer} img Image/Video Buffer
   * @param {String} url Image/Video URL
   * @param {...String} 
   */
  async sticker(img, url, ...args) {
    let lastError
    for (let func of [
      sticker3, // sticker5,
      this.support.ffmpeg && this.support.ffmpegWebp && sticker4,
      this.support.ffmpeg && (this.support.convert || this.support.magick || this.support.gm) && sticker2,
      sticker1
    ].filter(f => f)) {
      try {
        let stiker = await func(img, url, ...args)
        if (stiker.includes('RIFF')) {
          try {
            return await addExif(stiker, ...args)
          } catch (e) {
            return stiker
          }
        }
        throw stiker.toString()
      } catch (err) {
        lastError = err
      }
    }
    return lastError
  },
  sticker1,
  sticker2,
  sticker3,
  sticker4,
  sticker5,
  addExif,
  support: {
    ffmpeg: true,
    ffprobe: true,
    ffmpegWebp: true,
    convert: true,
    magick: false,
    gm: false,
    find: false
  }, imageToWebp, videoToWebp, writeExifImg, writeExifVid, writeExif
}