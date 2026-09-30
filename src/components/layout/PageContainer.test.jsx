import { render, screen } from '@testing-library/react';
import PageContainer, { PageTitle } from './PageContainer';

test('PageContainer renders its children', () => {
  render(
    <PageContainer>
      <p>Body</p>
    </PageContainer>
  );
  expect(screen.getByText('Body')).toBeInTheDocument();
});

test('PageTitle renders an h1 by default and an h2 on request', () => {
  render(
    <>
      <PageTitle>First</PageTitle>
      <PageTitle as="h2">Second</PageTitle>
    </>
  );
  expect(screen.getByRole('heading', { level: 1, name: 'First' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { level: 2, name: 'Second' })).toBeInTheDocument();
});
