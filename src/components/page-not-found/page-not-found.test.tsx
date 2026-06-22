import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PageNotFound } from './page-not-found';

describe('PageNotFound', () => {
  it('renders 404 heading, subtitle and a link to home page', () => {
    render(
      <MemoryRouter>
        <PageNotFound />
      </MemoryRouter>
    );

    // Проверяем наличие заголовка 404
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('404');

    // Проверяем наличие подзаголовка
    expect(screen.getByText('Page not found')).toBeInTheDocument();

    // Проверяем ссылку на главную страницу
    const link = screen.getByRole('link', { name: /go to main page/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
