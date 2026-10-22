import { useEffect, useRef, useState } from 'react'
import './ElasticReel.css'

export type ReelItem = { title: string; artist: string; subtitle: string; tone: string; focus?: number }

type ElasticReelProps = { items: ReelItem[]; volume?: number; onOpen?: (item: ReelItem, index: number) => void }

const ElasticReel = ({ items, volume = 58, onOpen }: ElasticReelProps) => {
  const [active, setActive] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const [media, setMedia] = useState<Record<string, { artwork: string; preview?: string }>>({})
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all(items.map(async item => {
      try {
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(`${item.title} ${item.artist}`)}&entity=song&limit=1`)
        const data = await response.json()
        const result = data.results?.[0]
        const image = result?.artworkUrl100?.replace('100x100', '600x600')
        return image ? [item.title, { artwork: image, preview: result.previewUrl }] as const : null
      } catch {
        return null
      }
    })).then(results => {
      if (cancelled) return
      const found = results.filter(Boolean) as Array<readonly [string, { artwork: string; preview?: string }]>
      setMedia(Object.fromEntries(found))
    })
    return () => { cancelled = true }
  }, [items])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
  }, [volume])

  const playTrack = (item: ReelItem, index: number) => {
    setActive(index)
    const preview = media[item.title]?.preview
    if (preview && audioRef.current) {
      audioRef.current.src = preview
      audioRef.current.volume = volume / 100
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
    onOpen?.(item, index)
  }

  const select = (item: ReelItem, index: number) => {
    const next = active === index ? -1 : index
    if (next === -1) {
      audioRef.current?.pause()
      setPlaying(false)
      setActive(-1)
      return
    }
    playTrack(item, index)
  }

  const playCurrent = () => {
    if (active === -1) {
      playTrack(items[0], 0)
      return
    }
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }

  const step = (direction: number) => {
    const index = active === -1 ? 0 : (active + direction + items.length) % items.length
    playTrack(items[index], index)
  }

  return <div className="elastic-reel" aria-label="Music taste selector">
    <audio ref={audioRef} preload="none" aria-hidden="true" onEnded={() => {
      if (active < 0 || !items.length) return
      const nextIndex = (active + 1) % items.length
      playTrack(items[nextIndex], nextIndex)
    }} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} />
    <div className="elastic-reel__dock">{items.map((item, index) => <button type="button" key={item.title} className={`elastic-reel__slice ${active === index ? 'is-active' : ''}`} style={{ '--reel-tone': item.tone, '--reel-focus': `${(item.focus ?? 0.5) * 100}%` } as React.CSSProperties} onClick={() => select(item, index)} aria-label={`Play ${item.title} by ${item.artist}`}><span className="elastic-reel__art" style={media[item.title] ? { backgroundImage: `url(${media[item.title].artwork})` } : undefined} /><span className="elastic-reel__meta"><strong>{item.title}</strong><small>{item.subtitle}</small></span></button>)}</div>
    <div className="elastic-reel__controls" aria-label="Music controls">
      <button type="button" onClick={() => step(-1)} aria-label="Previous song">⏮</button>
      <button type="button" className="elastic-reel__play" onClick={playCurrent} aria-label={playing ? 'Pause song' : 'Play song'}>{playing ? 'Ⅱ' : '▶'}</button>
      <button type="button" onClick={() => step(1)} aria-label="Next song">⏭</button>
    </div>
    <p className="elastic-reel__hint">hover a slice · click to select</p>
  </div>
}

export default ElasticReel
