import { useEffect, useState } from 'react'
import { AnimatePresence, MotionConfig as MotionConfigBase, motion } from 'motion/react'
import './App.css'
import TextCursor from './TextCursor'
import RotatingText from './RotatingText'
import FolderFloat from './FolderFloat'
import TextType from './TextType'
import MusicTaste from './MusicTaste'
import ShapeGrid from './ShapeGrid'
import FlappyModal from './FlappyModal'
import BlurHighlight from './BlurHighlight'
import TechText from './TechText'

const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } } }
const navItems = [['About', '#about'], ['Projects', '#projects'], ['Skills', '#skills'], ['Contact', '#contact']]
const socialLinks = [
  ['Gmail', 'mailto:rishab420rawat@gmail.com'],
  ['Instagram', 'https://www.instagram.com/rishab_nuos/?hl=en'],
  ['LinkedIn', 'https://www.linkedin.com/in/rishabrawat9000'],
  ['GitHub', 'https://github.com/rishabrawat9000-ux'],
]
function Arrow() { return <span aria-hidden="true">↗</span> }
function ScrollAnimations() { useEffect(() => { const targets = document.querySelectorAll<HTMLElement>('.site-shell main > section:not(.hero), .site-shell > footer'); targets.forEach(target => target.classList.add('scroll-reveal')); const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } }), { threshold: .12 }); targets.forEach(target => observer.observe(target)); return () => observer.disconnect() }, []); return null }
function MotionConfig({ children, ...props }: React.ComponentProps<typeof MotionConfigBase>) { return <MotionConfigBase {...props}><ScrollAnimations />{children}</MotionConfigBase> }

function NetworkDiagram() { const nodes = [[50,46],[135,25],[136,108],[229,65],[310,29],[322,126],[402,75]]; return <div className="network-canvas" aria-label="Illustrative machine-learning network diagram"><div className="canvas-bar"><span>ML_PIPELINE / v0.3</span><i /><span>LIVE VIEW</span></div><svg viewBox="0 0 450 160" role="img" aria-hidden="true"><g className="network-lines"><path d="M50 46L135 25 229 65 310 29 402 75M135 25L136 108 229 65 322 126 402 75M136 108L229 65 310 29M229 65L322 126" /></g>{nodes.map(([cx,cy],index)=><motion.circle key={index} className={`network-node node-${index}`} cx={cx} cy={cy} r={index===3?10:7} animate={{scale:[1,1.22,1],opacity:[.82,1,.82]}} transition={{duration:2.5+index*.17,repeat:Infinity,ease:'easeInOut',delay:index*.12}} />)}<motion.circle className="network-packet" cx="50" cy="46" r="4" animate={{cx:[50,135,229,310,402],cy:[46,25,65,29,75]}} transition={{duration:4.5,repeat:Infinity,ease:'linear'}} /></svg><div className="canvas-footer"><span><b /> features</span><span>model → inference</span></div><span className="diagram-note note-a">signals in</span><span className="diagram-note note-b">decision out</span></div> }
function UrlPreview() { return <div className="project-preview url-preview" aria-label="Illustrative URL classification interface"><div className="preview-top"><span>URL ANALYZER</span><span className="demo-tag">DEMO DATA</span></div><div className="url-input"><span>⌕</span><code>secure-account-check[.]net</code></div><div className="url-data"><div className="feature-stack"><small>EXTRACTED FEATURES</small><span>URL length <b>42</b></span><span>special chars <b>3</b></span><span>HTTPS token <b>0</b></span></div><div className="verdict"><small>CLASSIFICATION</small><strong>PHISHING</strong><i>illustrative result</i></div></div><div className="model-flow"><span>LEXICAL<br />FEATURES</span><i>→</i><span>RANDOM<br />FOREST</span><i>→</i><span>RESULT</span></div></div> }
function DefencePreview() { return <div className="project-preview defence-preview" aria-label="Illustrative network forecasting interface"><div className="preview-top"><span>NETWORK STATE / t+03</span><span className="demo-tag">SIMULATED</span></div><div className="forecast-grid"><div className="forecast-graph"><svg viewBox="0 0 310 108" aria-hidden="true"><path className="graph-line muted" d="M3 88C35 78 40 84 69 63S100 74 130 51s32 12 58 28 37-32 59-48 35 12 60-17" /><path className="graph-line active" d="M3 91C28 90 35 80 61 82s38-37 65-21 36 13 58 5 40-35 58-24 26-4 65-27" /><path className="forecast-line" d="M230 48c24-9 44-1 77-24" /><line className="future-line" x1="229" y1="8" x2="229" y2="102" /></svg><small>OBSERVED <b>→</b> FORECAST</small></div><div className="attack-stage"><small>PREDICTED STAGE</small><strong>DISCOVERY</strong><span>t + 15 min</span></div></div><div className="network-row"><span className="net-dot" /> <code>10.0.2.14</code><i>→</i><span className="net-dot warn" /><code>172.16.4.22</code><b>LSTM WORLD MODEL</b></div></div> }
function ProjectCard({number,title,type,children,tags,preview,progress,repo}:{number:string,title:string,type:string,children:React.ReactNode,tags:string[],preview:React.ReactNode,progress?:boolean,repo:string}) { return <motion.article className={`project-card ${progress?'project-card--dark':''}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{once:true,amount:.18}} whileHover={{y:-7}} transition={{type:'spring',stiffness:280,damping:25}}><div className="project-meta"><span>PROJECT {number}</span><span>{type}</span>{progress&&<span className="in-progress">IN DEVELOPMENT</span>}</div>{preview}<div className="project-content"><div><h3>{title}</h3><p>{children}</p></div><Arrow /></div><div className="project-bottom"><div className="tag-list">{tags.map(tag=><span key={tag}>{tag}</span>)}</div><a className="case-study" href={repo} target="_blank" rel="noreferrer">View repository <Arrow /></a></div></motion.article> }
function SkillGroup({n,title,skills,ongoing,open,onToggle,onHoverOpen}:{n:string,title:string,skills:string[],ongoing?:boolean,open:boolean,onToggle:()=>void,onHoverOpen:()=>void}) { const palette:Record<string,[string,string]> = {'01':['#1a1a1a','#eeeeee'],'02':['#242424','#e6e6e6'],'03':['#e10600','#f1f1f1'],'04':['#333333','#dddddd']}; const [folderColor,frontColor]=palette[n] ?? palette['01']; return <motion.article className="skill-group" variants={reveal} initial="hidden" whileInView="visible" viewport={{once:true,amount:.3}} whileHover={{y:-4}}><FolderFloat items={skills} label={title} sublabel={ongoing?'ONGOING':skills.length+' skills'} folderColor={folderColor} frontColor={frontColor} open={open} onToggle={onToggle} onHoverOpen={onHoverOpen} /></motion.article> }

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [quirkIndex, setQuirkIndex] = useState(0)
  const [flappyOpen, setFlappyOpen] = useState(false)
  const [openSkillGroup, setOpenSkillGroup] = useState<string | null>(null)
  const quirkFacts = ['I collect ideas before I collect tabs.', 'I debug by asking better questions.', 'Cat art is part of the brand.', 'I turn curiosity into systems.']
  const stampQuirk = () => setQuirkIndex(index => (index + 1) % quirkFacts.length)

  useEffect(() => {
    if (openSkillGroup === null) return
    const timer = window.setTimeout(() => setOpenSkillGroup(null), 5000)
    return () => window.clearTimeout(timer)
  }, [openSkillGroup])

  return (
    <MotionConfig reducedMotion="user">
      <div className={`site-shell ${darkMode ? 'theme-dark' : ''}`}>
        <ShapeGrid lineColor="rgba(17,17,17,.12)" hoverColor="#e10600" backgroundColor="transparent" />
        <header className="nav-wrap">
          <a href="#top" className="wordmark" aria-label="Rishab Rawat home" style={{ width: '280px', height: '48px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <TechText text="Rishab Rawat" fontWeight={700} fontSize={38} reveal="letter" dashLength={4} dashGap={2} specks={15} intro="none" introDuration={2} clickKick guides={false} />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(([label, href]) => <a href={href} key={href}>{label}</a>)}
            <a className="connect-link" href="#contact">Let&apos;s connect <Arrow /></a>
          </nav>
          <button className="menu-button" aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(!menuOpen)}><span>{menuOpen ? 'Close' : 'Menu'}</span><i /></button>
          <button className="theme-toggle" type="button" aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={darkMode} onClick={() => setDarkMode(!darkMode)}><span>{darkMode ? '☀' : '◐'}</span></button>
          <AnimatePresence>
            {menuOpen && <motion.nav id="mobile-nav" className="mobile-nav" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .2 }} aria-label="Mobile navigation">
              {navItems.map(([label, href], i) => <motion.a key={href} href={href} onClick={() => setMenuOpen(false)} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .08 + i * .05 }}>{label}<Arrow /></motion.a>)}
              <a href="#contact" onClick={() => setMenuOpen(false)}>Let&apos;s connect <Arrow /></a>
            </motion.nav>}
          </AnimatePresence>
        </header>
        <main id="top">
          <section className="hero shell-section" aria-labelledby="hero-title">
            <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: .1 } } }}>
              <motion.p variants={reveal} className="availability"><i /> OPEN TO INTERNSHIPS <span>— 2026</span></motion.p>
              <motion.h1 variants={reveal} id="hero-title">I build <em><RotatingText texts={['intelligent', 'innovative', 'analytical', 'creative']} rotationInterval={2400} effect="slide" direction="up" staggerFrom="last" staggerDuration={0.025} /></em><br />systems that solve<br />real problems<span>.</span></motion.h1>
              <motion.p variants={reveal} className="hero-description">I&apos;m Rishab — an AI/ML-focused developer working across machine learning, data, and cybersecurity.</motion.p>
              <motion.div variants={reveal} className="hero-actions"><a className="button button--ink" href="#projects">Explore my work <span>↓</span></a><a className="button button--plain" href="#contact">Get in touch <Arrow /></a></motion.div>
            </motion.div>
            <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96, rotate: 1.5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .75, delay: .25, ease: [.16, 1, .3, 1] }}><NetworkDiagram /><TextCursor text="RISHAB" fontSize={22} spacing={72} maxPoints={6} className="hero-cursor" /></motion.div>
            <div className="hero-facts"><span>01 / BASED IN<br /><b>UTTARAKHAND, IN</b></span><span>02 / STUDYING<br /><b>CSE · AI/ML</b></span><span>03 / EXPLORING<br /><b>AI × SECURITY</b></span></div>
          </section>
          <section id="about" className="about shell-section section-block" aria-labelledby="about-title">
            <motion.div className="section-label" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}><span>01</span> ABOUT / CONTEXT</motion.div>
            <div className="about-layout">
              <motion.div className="about-focus" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}><h2 id="about-title">Curiosity,<br /><em>structured.</em></h2><span className="scribble-arrow">↘</span><button type="button" className="about-portrait" onClick={() => setFlappyOpen(true)} aria-label="Play Flappy Cat Easter Egg game"><div className="portrait-ring portrait-ring--outer" /><div className="portrait-ring portrait-ring--inner" /><img src="/rishab-cat.jpg" alt="Illustrated cat portrait" /><span className="portrait-label">based in dehradun 📍</span></button></motion.div>
              <motion.div className="about-story" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .35 }}><BlurHighlight text="I'm a third-year Computer Science student specialising in AI/ML at DIT University, Dehradun." highlightWords={['AI/ML', 'Computer Science', 'DIT University']} /><BlurHighlight text="I build practical machine learning systems, from extracting meaningful patterns in data to developing applications around trained models." highlightWords={['practical', 'machine learning', 'applications']} /><BlurHighlight text="Currently exploring AI engineering, predictive systems, and cybersecurity." highlightWords={['AI engineering', 'predictive systems', 'cybersecurity']} /><button type="button" className="annotation-card" onClick={stampQuirk} aria-label="Stamp another quirky fact"><span>QUIRKY NOTE_0{quirkIndex + 1}</span><b key={quirkIndex}>{quirkFacts[quirkIndex]}</b><i>click to stamp another</i></button></motion.div>
            </div>
          </section>
          <section className="signal-space shell-section" aria-label="Current status"><div className="signal-space__label"><span>STATUS</span><i /> LIVE SIGNAL</div><TextType text={['AI/ML systems in progress.', 'Curiosity under construction.', 'Open to meaningful problems.']} prefix="> " typingSpeed={48} pauseDuration={1400} deletingSpeed={28} textColors={['#e10600']} /></section>
          <section id="projects" className="projects shell-section section-block" aria-labelledby="projects-title">
            <motion.div className="section-heading" variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}><div className="section-label"><span>02</span> SELECTED WORK</div><h2 id="projects-title">Built to investigate.<br /><em>Designed to explain.</em></h2><p>Two systems at different stages: one complete classifier, one forecasting project in active development.</p></motion.div>
            <div className="project-grid"><ProjectCard number="01" title="Phishing URL Detection System" type="ML CLASSIFICATION" tags={['Python', 'Scikit-learn', 'Flask', 'Pandas', 'Joblib']} repo="https://github.com/rishabrawat9000-ux/phising_detector.git" preview={<UrlPreview />}>An ML-based system that classifies URLs as phishing or legitimate. It draws from a dataset of 101K+ URLs, engineers 25+ lexical features, evaluates Logistic Regression, Decision Tree, Random Forest, and SVM, then serves real-time classification through a Flask application.</ProjectCard><ProjectCard number="02" title="Predictive Cyber Defence" type="AI × CYBERSECURITY" progress tags={['PyTorch', 'SHAP', 'Streamlit', 'Scapy', 'Plotly']} repo="https://github.com/rishabrawat9000-ux/RAPTOR.git" preview={<DefencePreview />}>An ongoing project using CSE-CIC-IDS2018 traffic to develop an LSTM-based world model. The work explores temporal windows, multi-step attack forecasting, MITRE ATT&amp;CK stage mapping, and SHAP-based explainability.</ProjectCard></div>
          </section>
          <section id="skills" className="skills shell-section section-block" aria-labelledby="skills-title"><div className="section-label"><span>03</span> TOOLKIT / CURRENTLY USING</div><h2 id="skills-title">Technical <em>terrain.</em></h2><div className="skills-grid"><SkillGroup n="01" title="Languages" skills={['Python', 'Java', 'C', 'Go', 'SQL', 'JavaScript']} open={openSkillGroup === '01'} onToggle={() => setOpenSkillGroup(current => current === '01' ? null : '01')} onHoverOpen={() => setOpenSkillGroup('01')} /><SkillGroup n="02" title="Machine Learning & Data" skills={['Scikit-learn', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SciPy', 'XGBoost', 'Hugging Face']} open={openSkillGroup === '02'} onToggle={() => setOpenSkillGroup(current => current === '02' ? null : '02')} onHoverOpen={() => setOpenSkillGroup('02')} /><SkillGroup n="03" title="Development" skills={['Flask', 'Django', 'FastAPI', 'React', 'JavaScript', 'HTML / CSS', 'REST APIs']} open={openSkillGroup === '03'} onToggle={() => setOpenSkillGroup(current => current === '03' ? null : '03')} onHoverOpen={() => setOpenSkillGroup('03')} /><SkillGroup n="04" title="Tools" skills={['Git', 'GitHub', 'VS Code', 'Jupyter Notebook', 'Streamlit', 'Docker', 'Linux', 'Postman']} open={openSkillGroup === '04'} onToggle={() => setOpenSkillGroup(current => current === '04' ? null : '04')} onHoverOpen={() => setOpenSkillGroup('04')} /></div><p className="skill-note">* Project-specific and ongoing technologies are marked accordingly; this is a map of active learning, not a claim of mastery.</p></section>
          <section id="resume" className="resume shell-section section-block" aria-labelledby="resume-title"><div className="resume-intro"><div className="section-label"><span>04</span> RESUME / PROFILE</div><h2 id="resume-title">Built to learn.<br /><em>Ready to contribute.</em></h2><a className="button button--ink resume-download" href="/rishab-rawat-resume.pdf" download>Download resume <Arrow /></a></div><div className="resume-sheet"><div className="resume-sheet-top"><span>RISHAB RAWAT</span><span>AI/ML · DATA · SECURITY</span></div><div className="resume-summary"><div><small>EDUCATION</small><strong>DIT University, Dehradun</strong><p>B.Tech, Computer Science &amp; Engineering (AI/ML)</p></div><div><small>CONTACT</small><p>rishab420rawat@gmail.com<br />Dehradun, Uttarakhand</p></div></div><div className="resume-about"><small>ABOUT ME</small><p>3rd year B.Tech student in Computer Science and Engineering (AI/ML) at DIT University, interested in AI engineering and data science internships. Hands-on project experience with Python, machine learning workflows, feature engineering, and Flask-based applications.</p></div><div className="resume-skills"><small>CORE SKILLS</small><div><span>Python</span><span>Machine Learning</span><span>Flask</span><span>PyTorch</span><span>Scikit-learn</span><span>SQL</span><span>Git / GitHub</span><span>Cybersecurity</span></div></div></div></section>
          <section className="signal-space shell-section exploring-space" aria-label="Areas of exploration">
            <div className="signal-space__label"><span>EXPLORING</span><i /> AREAS OF INTEREST</div>
            <TextType text={['Artificial Intelligence', 'Generative AI', 'Full-Stack Development', 'Data Science', 'Systems Design', 'Cloud Computing', 'Cybersecurity', 'Open Source']} prefix="> " typingSpeed={50} pauseDuration={1000} deletingSpeed={28} deleteMode="backspace" typeEffect="fade" cursorStyle="bar" textColors={['#e10600']} className="exploring-topics" />
          </section>
          <MusicTaste />
        </main>
        <footer id="contact" className="contact"><div className="shell-section"><div className="section-label"><span>06</span> CONTACT / NEXT NODE</div><h2>Let&apos;s build something<br /><em>worth investigating.</em></h2><p>Interested in discussing AI/ML internships, data, or engineering opportunities? My inbox is open.</p><a className="email-link" href="mailto:rishab420rawat@gmail.com">rishab420rawat@gmail.com <Arrow /></a><div className="footer-row"><span>RISHAB.R © 2026</span><div className="social-links">{socialLinks.map(([label, href]) => <a key={label} className={`social-button ${label === 'LinkedIn' ? 'social-button--linkedin' : ''}`} href={href} target="_blank" rel="noreferrer">{label} <Arrow /></a>)}</div></div></div></footer>
      </div>
      <FlappyModal isOpen={flappyOpen} onClose={() => setFlappyOpen(false)} />
    </MotionConfig>
  )
}

export default App
