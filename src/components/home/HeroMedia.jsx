import styles from './HeroMedia.module.css';

export default function HeroMedia({ videoSrc, poster, alt }) {
  return (
    <section className={styles.root}>
      <div className={styles.frame}>
        {videoSrc ? (
          <video
            className={styles.media}
            src={videoSrc}
            poster={poster || undefined}
            aria-label={alt}
            muted
            loop
            autoPlay
            playsInline
          />
        ) : poster ? (
          <img className={styles.media} src={poster} alt={alt} />
        ) : null}
      </div>
    </section>
  );
}
