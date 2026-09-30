import { Link } from 'react-router-dom';

// **bold**, _italic_ (not inside words), [label](href); newlines become <br>
const TOKEN = /\*\*(.+?)\*\*|(?<!\w)_(.+?)_(?!\w)|\[([^\]]+)\]\(([^)\s]+)\)/g;
const SAFE_HREF = /^(\/|https?:\/\/|mailto:)/i;

function withBreaks(text, keyPrefix) {
  const lines = text.split('\n');
  return lines.flatMap((line, i) => (i === 0 ? [line] : [<br key={`${keyPrefix}-br${i}`} />, line]));
}

function renderLink(label, href, key) {
  if (!SAFE_HREF.test(href)) return label;
  if (href.startsWith('/')) {
    return (
      <Link key={key} to={href}>
        {label}
      </Link>
    );
  }
  return (
    <a key={key} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer">
      {label}
    </a>
  );
}

export default function RichText({ text }) {
  const nodes = [];
  let last = 0;
  let n = 0;
  for (const match of text.matchAll(TOKEN)) {
    const [whole, bold, italic, label, href] = match;
    if (match.index > last) nodes.push(...withBreaks(text.slice(last, match.index), `t${n}`));
    const key = `m${n}`;
    if (bold !== undefined) nodes.push(<strong key={key}>{withBreaks(bold, key)}</strong>);
    else if (italic !== undefined) nodes.push(<em key={key}>{withBreaks(italic, key)}</em>);
    else nodes.push(renderLink(label, href, key));
    last = match.index + whole.length;
    n += 1;
  }
  if (last < text.length) nodes.push(...withBreaks(text.slice(last), `t${n}`));
  return <>{nodes}</>;
}
