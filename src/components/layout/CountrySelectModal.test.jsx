import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CountrySelectModal from './CountrySelectModal';

const region = {
  title: 'Welcome to Streetnut',
  prompt: 'You are shipping to:',
  save: 'Save',
  countries: [
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  ],
  selected: 'US',
};

const setup = (props) => {
  const onClose = vi.fn();
  render(<CountrySelectModal open onClose={onClose} region={region} {...props} />);
  return onClose;
};

test('renders nothing when closed', () => {
  setup({ open: false });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('shows the title, label, country select and Save', () => {
  setup();
  const dialog = screen.getByRole('dialog', { name: 'Welcome to Streetnut' });
  expect(dialog).toHaveAttribute('aria-modal', 'true');
  const select = screen.getByRole('combobox', { name: 'You are shipping to:' });
  expect(select).toHaveValue('US');
  expect(screen.getByRole('option', { name: 'United Kingdom / GBP' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
});

test('the close button, Save and Escape all call onClose', async () => {
  const user = userEvent.setup();
  const onClose = setup();
  await user.click(screen.getByRole('button', { name: 'Close' }));
  await user.click(screen.getByRole('button', { name: 'Save' }));
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(3);
});

test('clicking the overlay or inside the dialog does not close it', async () => {
  const user = userEvent.setup();
  const onClose = setup();
  await user.click(screen.getByRole('dialog'));
  await user.click(screen.getByTestId('country-overlay'));
  expect(onClose).not.toHaveBeenCalled();
});

test('the select can be changed', async () => {
  const user = userEvent.setup();
  setup();
  const select = screen.getByRole('combobox');
  await user.selectOptions(select, 'GB');
  expect(select).toHaveValue('GB');
});

test('locks page scroll while open', () => {
  setup();
  expect(document.body.style.overflow).toBe('hidden');
});
