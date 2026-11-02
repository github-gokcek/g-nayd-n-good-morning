import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { ArrowRight, Heart, Gamepad2, Tv, Sparkles, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chooseSequence, jokeForStep } from '@/lib/questions';
import evening from '@/assets/sakura-evening.jpg';
import backgroundLoop from '@/assets/background-loop.mp4';
import goksuAvatar from '@/assets/goksu-avatar.png';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: "Merhaba Göksu · Sana küçük bir sürpriz" },
    { name: 'description', content: 'Biraz TFT, biraz anime, en çok da sen. Göksu için hazırlanmış küçük bir davet.' },
    { property: 'og:title', content: 'Merhaba Göksu · Sana küçük bir sürpriz' },
    { property: 'og:description', content: 'Biraz TFT, biraz anime, en çok da sen.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  const backgroundVideo = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<'welcome' | 'questions' | 'done'>('welcome');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioError, setAudioError] = useState('');
  const [sequence, setSequence] = useState<ReturnType<typeof chooseSequence>>([]);
  const [step, setStep] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [changed, setChanged] = useState(false);
  const [hops, setHops] = useState(0);
  const [celebration, setCelebration] = useState(0);
  const current = sequence[step];
  const joke = jokeForStep(step);

  function setBackgroundAudio(enabled: boolean) {
    const video = backgroundVideo.current;
    if (!video) {
      setAudioError('Arka plan videosuna erişilemedi. Sayfayı yenileyip tekrar deneyebilirsin.');
      return;
    }

    video.muted = !enabled;
    setAudioEnabled(enabled);
    setAudioError('');

    if (enabled) {
      void video.play().catch(() => {
        if (!video.muted) {
          video.muted = true;
          setAudioEnabled(false);
          setAudioError('Arka plan sesi başlatılamadı. Tarayıcı ayarlarını kontrol edip tekrar deneyebilirsin.');
        }
      });
    }
  }

  function start() {
    setBackgroundAudio(true);
    setSequence(chooseSequence());
    setStep(0); setConfirm(false); setChanged(false); setHops(0);
    setStage('questions');
  }
  function accept() {
    setConfirm(false); setChanged(false); setHops(0);
    setCelebration(value => value + 1);
    if (step + 1 >= sequence.length) setStage('done');
    else setStep(value => value + 1);
  }
  function negative() {
    if (joke === 'runaway' && hops < 2) setHops(value => value + 1);
    else if (joke === 'change' && !changed) setChanged(true);
    else if (changed) accept();
    else setConfirm(true);
  }

  return (
    <main className="love-page">
      <video ref={backgroundVideo} className="evening-background" src={backgroundLoop} poster={evening} autoPlay muted={!audioEnabled} loop playsInline aria-hidden="true" />
      <div className="scene-wash" />
      <div className="floating-hearts" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => <Heart key={index} className={`float-heart heart-${index}`} />)}
      </div>
      <header className="love-header">
        <span className="little-wordmark"><Heart size={16} fill="currentColor" /> sadece senin için</span>
        <div className="header-actions">
          <span className="header-note">küçük bir sürpriz, kocaman bir kalp</span>
          <button
            type="button"
            className="sound-toggle"
            onClick={() => setBackgroundAudio(!audioEnabled)}
            aria-label={audioEnabled ? 'Arka plan sesini kapat' : 'Arka plan sesini aç'}
            aria-pressed={audioEnabled}
          >
            {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {audioEnabled ? 'Sesi kapat' : 'Sesi aç'}
          </button>
          {audioError && <span className="audio-error" role="status">{audioError}</span>}
        </div>
      </header>

      <section className="invitation" aria-live="polite">
        <div className="portrait-placeholder" aria-label="Göksu'nun profil resmi">
          <img className="portrait-image" src={goksuAvatar} alt="Göksu'nun kurbağa kapüşonlu anime karakteri" width={112} height={112} />
          <span className="portrait-sparkle"><Sparkles size={18} /></span>
        </div>

        {stage === 'welcome' && <div className="scene-content" key="welcome">
          <p className="eyebrow">EN SEVDİĞİM KİŞİYE</p>
          <h1>Merhaba <em>Göksu.</em></h1>
          <p className="intro-copy">Biraz TFT, biraz anime,<br />en çok da <span>sen.</span></p>
          <div className="small-divider"><span /><Heart size={13} /><span /></div>
          <p className="personal-note">Aklımda sen, sana soracak birkaç tatlı sorum var.</p>
          <Button className="romantic-button" onClick={start}>Hadi başlayalım <ArrowRight size={18} /></Button>
          <p className="under-button">İyi ki benim duo'msun.</p>
        </div>}

        {stage === 'questions' && current && <div className="scene-content" key={`${step}-${confirm}`}>
          <p className="eyebrow">{confirm ? 'KALBİM BİR DAHA SORUYOR' : current.kind === 'final' ? 'SON BİR KÜÇÜK DİLEK' : 'AKLIMDA BİR ŞEY VAR…'}</p>
          <h1 className="question-title">{confirm ? 'Bir minik şans daha?' : current.text}</h1>
          <p className="question-note">{confirm ? 'Seninle olunca her şey biraz daha güzel.' : changed ? 'Bak, kalbin de fikrini değiştirdi.' : hops > 0 ? 'Sanırım bu cevap biraz utangaç.' : current.kind === 'final' ? 'Çünkü en güzel planım, seninle olanı.' : 'Sen olunca sıradan bir akşam bile özel.'}</p>
          <div className="answer-area">
            {confirm ? <>
              <Button className="romantic-button" onClick={accept}>Peki, olur <Heart size={17} /></Button>
              <Button variant="outline" className="soft-button" onClick={accept}>Tamam, sen kazandın</Button>
            </> : <>
              <Button className="romantic-button" onClick={accept}>Evet, seve seve <Heart size={17} /></Button>
              <Button variant="outline" className={`soft-button playful-no hop-${hops}`} onPointerEnter={event => { if (event.pointerType === 'mouse' && joke === 'runaway' && hops < 2) setHops(value => value + 1); }} onClick={negative}>{changed ? 'Peki, olur ♡' : 'Hayır'}</Button>
            </>}
          </div>
          <div className="heart-progress" aria-label="Davet ilerlemesi">{sequence.map((question, index) => <Heart key={question.id} size={12} className={index <= step ? 'heart-active' : ''} fill={index <= step ? 'currentColor' : 'none'} />)}</div>
        </div>}

        {stage === 'done' && <div className="scene-content" key="done">
          <p className="eyebrow">EN GÜZEL CEVAP SENDİN</p>
          <h1>O zaman, <em>bu gece bizim.</em></h1>
          <p className="intro-copy">Lobi de hazır, bir bölüm de.<br />Eksik olan tek şey <span>sendin.</span></p>
          <div className="small-divider"><span /><Heart size={13} fill="currentColor" /><span /></div>
          <p className="personal-note">İyi ki varsın, Göksu. İyi ki biz.</p>
          <Button variant="ghost" className="replay-button" onClick={start}><RotateCcw size={15} /> Bir kez daha?</Button>
        </div>}
      </section>

      {celebration > 0 && <div key={celebration} className="heart-burst" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <Heart key={index} className={`burst-${index}`} fill="currentColor" />)}</div>}
      <footer className="love-footer">
        <div className="shared-things"><span><Gamepad2 size={16} /> aynı lobi</span><span className="footer-dot">·</span><span><Tv size={16} /> aynı anime</span><span className="footer-dot">·</span><span><Heart size={15} /> aynı heyecan</span></div>
        <p>Seninle, her evrende.</p>
      </footer>
    </main>
  );
}
