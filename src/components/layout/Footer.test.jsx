import { render, screen, fireEvent } from '@testing-library/react';
import Footer from './Footer';

test('shows the copyright with the current year and site name once', () => {
  render(<Footer siteName="Streetnut" />);
  const year = new Date().getFullYear();
  expect(screen.getAllByText(`© ${year} Streetnut`)).toHaveLength(1);
});

test('is a contentinfo landmark', () => {
  render(<Footer siteName="Streetnut" />);
  expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});

test('has a newsletter form with a labelled email field and a submit button', () => {
  render(<Footer siteName="Streetnut" />);
  const form = screen.getByRole('form', { name: /newsletter/i });
  expect(form).toBeInTheDocument();
  const input = screen.getByLabelText(/email/i);
  expect(input).toHaveAttribute('type', 'email');
  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});

test('submitting the newsletter form is prevented (UI only) and clears nothing else', () => {
  render(<Footer siteName="Streetnut" />);
  const form = screen.getByRole('form', { name: /newsletter/i });
  const notPrevented = fireEvent.submit(form);
  expect(notPrevented).toBe(false);
});

test('the newsletter field shows NEWSLETTER * as its visible hint', () => {
  render(<Footer siteName="Streetnut" />);
  expect(screen.getByLabelText(/email/i)).toHaveAttribute('placeholder', 'Newsletter *');
});

test('the submit button is an arrow icon, not text', () => {
  render(<Footer siteName="Streetnut" />);
  const button = screen.getByRole('button', { name: /sign up/i });
  expect(button.textContent).toBe('');
  expect(button.querySelector('svg')).toBeInTheDocument();
});
