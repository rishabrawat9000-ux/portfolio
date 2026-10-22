import { useEffect, useMemo, useState } from 'react'
import './TextType.css'

type TextTypeProps = {
  text: string | string[]
  prefix?: string
  typingSpeed?: number
  pauseDuration?: number
  deletingSpeed?: number
  deleteMode?: 'backspace' | 'select'
  typeEffect?: 'none' | 'fade'
  textColors?: string[]
  className?: string
  showCursor?: boolean
  cursorStyle?: 'character' | 'bar' | 'block' | 'underscore'
  cursorCharacter?: string
  loop?: boolean
}

const TextType = ({
  text,
  prefix = '',
  typingSpeed = 55,
  pauseDuration = 1600,
  deletingSpeed = 35,
  deleteMode = 'backspace',
  typeEffect = 'none',
  textColors = [],
  className = '',
  showCursor = true,
  cursorStyle = 'character',
  cursorCharacter = '|',
  loop = true,
}: TextTypeProps) => {
  const texts = useMemo(() => Array.isArray(text) ? text : [text], [text])
  const [textIndex, setTextIndex] = useState(0)
  const [shown, setShown] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [selected, setSelected] = useState(0)
  const [reduceMotion, setReduceMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const current = texts[textIndex] ?? ''

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const complete = shown === current
    const timer = window.setTimeout(() => {
      if (!deleting && !complete) setShown(current.slice(0, shown.length + 1))
      else if (!deleting && complete) setDeleting(true)
      else if (deleting && shown && deleteMode === 'select' && selected < shown.length) setSelected(value => value + 1)
      else if (deleting && shown && deleteMode === 'select') { setShown(''); setSelected(0) }
      else if (deleting && shown) setShown(shown.slice(0, -1))
      else {
        setDeleting(false)
        setSelected(0)
        if (loop || textIndex < texts.length - 1) setTextIndex(index => (index + 1) % texts.length)
      }
    }, deleting ? (shown ? deletingSpeed : 100) : complete ? pauseDuration : typingSpeed)

    return () => window.clearTimeout(timer)
  }, [current, deleteMode, deleting, deletingSpeed, loop, pauseDuration, reduceMotion, selected, shown, textIndex, texts.length, typingSpeed])

  const color = textColors.length ? textColors[textIndex % textColors.length] : undefined
  const caret = cursorStyle === 'character'
    ? <span className="text-type__character">{cursorCharacter}</span>
    : <span className={`text-type__shape text-type__shape--${cursorStyle}`} />

  return <span className={`text-type ${className}`.trim()}>
    <span className="text-type__sr">{prefix}{texts.join(' · ')}</span>
    <span className="text-type__content" aria-hidden="true">
      {prefix && <span className="text-type__prefix">{prefix}</span>}
      <span className="text-type__value" style={{ color }}>
        {Array.from(reduceMotion ? current : shown).map((character, index) => <span className={`${typeEffect === 'fade' ? 'text-type__char text-type__char--fade' : 'text-type__char'} ${!reduceMotion && deleting && deleteMode === 'select' && index >= shown.length - selected ? 'text-type__char--selected' : ''}`} key={`${textIndex}-${index}`}>{character}</span>)}
      </span>
      {showCursor && <span className="text-type__cursor" aria-hidden="true">{caret}</span>}
    </span>
  </span>
}

export default TextType
