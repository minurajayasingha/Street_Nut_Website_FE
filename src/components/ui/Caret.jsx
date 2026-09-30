export default function Caret({ className, width, height }) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 7.75 5.09"
      aria-hidden="true"
    >
      <polygon
        points="3.88 0 7.75 4.43 7 5.09 3.88 1.52 .75 5.09 0 4.43 3.88 0"
        fill="currentColor"
      />
    </svg>
  );
}
