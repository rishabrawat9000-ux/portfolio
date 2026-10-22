import { useState } from 'react'
import ElasticReel, { type ReelItem } from './ElasticReel'
import ElasticSlider from './ElasticSlider'
import './MusicTaste.css'

const tracks: ReelItem[] = [
  { title: 'Stronger', artist: 'Kanye West', subtitle: 'Graduation · Kanye West', tone: '#d8d8d8', focus: 0.08 },
  { title: 'Gold Digger', artist: 'Kanye West', subtitle: 'Late Registration · Kanye West', tone: '#d8d8d8', focus: 0.22 },
  { title: 'Heartless', artist: 'Kanye West', subtitle: '808s & Heartbreak · Kanye West', tone: '#d8d8d8', focus: 0.36 },
  { title: 'Creep', artist: 'Radiohead', subtitle: 'Radiohead', tone: '#d8d8d8', focus: 0.5 },
  { title: 'Thunderstruck', artist: 'AC/DC', subtitle: 'AC/DC', tone: '#d8d8d8', focus: 0.64 },
  { title: 'Dream On', artist: 'Aerosmith', subtitle: 'Aerosmith', tone: '#d8d8d8', focus: 0.76 },
  { title: 'Billie Jean', artist: 'Michael Jackson', subtitle: 'Michael Jackson', tone: '#d8d8d8', focus: 0.88 },
  { title: 'Loser', artist: 'Tame Impala', subtitle: 'Tame Impala', tone: '#d8d8d8', focus: 0.98 },
]

const MusicTaste = () => {
  const [selected, setSelected] = useState(tracks[0])
  const [volume, setVolume] = useState(58)
  return <section className="music-taste shell-section section-block" aria-labelledby="music-title"><div className="section-label"><span>05</span> LISTENING LOG / CURRENTLY PLAYING</div><div className="music-taste__header"><div><h2 id="music-title">Soundtrack<br /><em>of the work.</em></h2><p>Different modes for different kinds of curiosity.</p></div><div className="music-taste__now"><small>NOW PLAYING</small><strong>{selected.title}</strong><span>{selected.subtitle}</span><ElasticSlider onChange={setVolume} /></div></div><ElasticReel items={tracks} volume={volume} onOpen={item => setSelected(item)} /></section>
}

export default MusicTaste
