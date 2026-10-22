import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import './RotatingText.css'

type RotatingTextProps = {
  texts: string[]
  effect?: 'slide' | 'flip' | 'blur' | 'scale' | 'drop'
  rotationInterval?: number
  staggerDuration?: number
  staggerFrom?: 'first' | 'last'
  direction?: 'up' | 'down'
  className?: string
}

const RotatingText = ({
  texts,
  effect = 'slide',
  rotationInterval = 2000,
  staggerDuration = 0.025,
  staggerFrom = 'last',
  direction = 'up',
  className = '',
}: RotatingTextProps) => {
  void effect
  const [index, setIndex] = useState(0)
  const characters = useMemo(() => Array.from(texts[index] ?? ''), [texts, index])

  useEffect(() => {
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % texts.length), rotationInterval)
    return () => window.clearTimeout(timer)
  }, [index, rotationInterval, texts.length])

  const enterY = direction === 'up' ? '100%' : '-100%'
  const exitY = direction === 'up' ? '-120%' : '120%'

  return <span className={`rotating-text ${className}`.trim()} aria-label={texts[index]}>
    <span className="rotating-text__sr-only">{texts[index]}</span>
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={texts[index]} className="rotating-text__word" aria-hidden="true">
        {characters.map((character, characterIndex) => {
          const delayIndex = staggerFrom === 'last' ? characters.length - 1 - characterIndex : characterIndex
          return <motion.span key={`${character}-${characterIndex}`} className="rotating-text__character" initial={{ y: enterY, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: exitY, opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 300, delay: delayIndex * staggerDuration }}>{character}</motion.span>
        })}
      </motion.span>
    </AnimatePresence>
  </span>
}

export default RotatingText
