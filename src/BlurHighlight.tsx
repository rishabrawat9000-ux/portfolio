import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import './BlurHighlight.css'

type BlurHighlightProps = {
  text: string
  highlightWords?: string[]
  className?: string
}

function BlurWord({ word, index, total, progress, highlighted }: { word: string; index: number; total: number; progress: ReturnType<typeof useScroll>['scrollYProgress']; highlighted: boolean }) {
  const start = index / total
  const end = Math.min(1, start + 0.4)
  const blur = useTransform(progress, [start, end], [12, 0])
  const opacity = useTransform(progress, [start, end], [0.15, 1])
  const filter = useTransform(blur, value => `blur(${value}px)`)

  return <motion.span style={{ filter, opacity }} className={`blur-word ${highlighted ? 'is-highlighted' : ''}`}>{word}{' '}</motion.span>
}

export default function BlurHighlight({ text, highlightWords = [], className = '' }: BlurHighlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'start 0.35']
  })

  // Split text into words
  const words = text.split(' ')

  return (
    <div ref={containerRef} className={`blur-highlight-container ${className}`}>
      {words.map((word, i) => {
        // Clean punctuation for matching
        const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '')
        const isHighlighted = highlightWords.some(hw => hw.toLowerCase() === cleanWord.toLowerCase())

        return <BlurWord key={`${word}-${i}`} word={word} index={i} total={words.length} progress={scrollYProgress} highlighted={isHighlighted} />
      })}
    </div>
  )
}
