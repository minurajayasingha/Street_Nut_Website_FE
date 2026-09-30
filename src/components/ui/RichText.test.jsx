import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RichText from './RichText';

const setup = (text) =>
  render(
    <MemoryRouter>
      <p data-testid="out">
        <RichText text={text} />
      </p>
    </MemoryRouter>
  );

test('renders plain text as is', () => {
  setup('Plain words');
  expect(screen.getByTestId('out')).toHaveTextContent('Plain words');
  expect(screen.getByTestId('out').children).toHaveLength(0);
});

test('renders **bold** as strong', () => {
  setup('Before **Heading** after');
  expect(screen.getByText('Heading').tagName).toBe('STRONG');
  expect(screen.getByTestId('out')).toHaveTextContent('Before Heading after');
});

test('renders _italic_ as em', () => {
  setup('Note: _small print_ here');
  expect(screen.getByText('small print').tagName).toBe('EM');
});

test('does not treat underscores inside words as italics', () => {
  setup('snake_case_name');
  expect(screen.getByTestId('out').querySelector('em')).toBeNull();
});

test('turns newlines into line breaks', () => {
  setup('one\ntwo\n\nthree');
  expect(screen.getByTestId('out').querySelectorAll('br')).toHaveLength(3);
});

test('renders [text](/path) as a router link', () => {
  setup('See [Terms of Use](/legal) now');
  expect(screen.getByRole('link', { name: 'Terms of Use' })).toHaveAttribute('href', '/legal');
});

test('renders external links in a new tab', () => {
  setup('Go [there](https://example.com/a_b_c)');
  const link = screen.getByRole('link', { name: 'there' });
  expect(link).toHaveAttribute('href', 'https://example.com/a_b_c');
  expect(link).toHaveAttribute('target', '_blank');
});

test('keeps unmatched markers as literal text', () => {
  setup('a ** b and [broken](');
  expect(screen.getByTestId('out')).toHaveTextContent('a ** b and [broken](');
});

test('never injects raw html', () => {
  setup('<b>bold</b> <img src=x onerror=alert(1)>');
  expect(screen.getByTestId('out').querySelector('b, img')).toBeNull();
  expect(screen.getByTestId('out')).toHaveTextContent('<b>bold</b>');
});

test('handles combined formatting in one line', () => {
  setup('**Title**\n_note_ and [link](/x)');
  expect(screen.getByText('Title').tagName).toBe('STRONG');
  expect(screen.getByText('note').tagName).toBe('EM');
  expect(screen.getByRole('link', { name: 'link' })).toBeInTheDocument();
});

test('drops links with unsafe protocols but keeps their label', () => {
  setup('[click](javascript:void0) me');
  expect(screen.queryByRole('link')).toBeNull();
  expect(screen.getByTestId('out')).toHaveTextContent('click me');
});
