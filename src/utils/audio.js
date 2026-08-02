// Utility for lazy-loading and playing audio files from /audio
// Prepared for future addition of real .mp3/.ogg assets.
// Functions are safe if files are missing: they fail silently and return resolved promises.

const audioCache = new Map()

async function loadAudio(src){
  if(!src) return null
  if(audioCache.has(src)) return audioCache.get(src)

  try{
    const audio = new Audio(src)
    audio.preload = 'auto'
    // Try to load metadata; browsers may block autoplay until user interaction
    const promise = new Promise((resolve) => {
      const onCan = () => { audio.removeEventListener('canplaythrough', onCan); resolve(audio) }
      const onErr = () => { audio.removeEventListener('error', onErr); resolve(null) }
      audio.addEventListener('canplaythrough', onCan)
      audio.addEventListener('error', onErr)
      // Begin load
      audio.load()
      // Fallback resolve after short timeout
      setTimeout(()=>resolve(audio), 1200)
    })
    audioCache.set(src, promise)
    return promise
  }catch(e){
    return null
  }
}

export async function playAudioFile(path, { loop=false, volume=1.0 } = {}){
  try{
    const audio = await loadAudio(path)
    if(!audio) return
    audio.loop = loop
    audio.volume = typeof volume === 'number' ? Math.max(0, Math.min(1, volume)) : 1
    // attempt play; browsers may require user gesture
    const playPromise = audio.play()
    if(playPromise && typeof playPromise.then === 'function'){
      playPromise.catch(()=>{/* autoplay blocked - ignore silently */})
    }
    return audio
  }catch(e){
    return null
  }
}

export function stopAudioInstance(audio){
  try{
    if(!audio) return
    audio.pause()
    audio.currentTime = 0
  }catch(e){}
}

export function clearAudioCache(){
  audioCache.clear()
}
