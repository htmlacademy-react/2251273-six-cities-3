import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './footer';
import { AppRoute } from '../../const';

vi.mock('../../assets/img/logo.svg', () => ({
  default: 'mock-logo.svg',
}));

describe('Footer component', () => {
  const renderWithRouter = (component: React.ReactNode) => render(<BrowserRouter>{component}</BrowserRouter>);

  it('should render footer with correct container class', () => {
    renderWithRouter(<Footer />);
    const footerElement = document.querySelector('footer.footer.container');
    expect(footerElement).toBeInTheDocument();
  });

  it('should contain a link to the main page', () => {
    renderWithRouter(<Footer />);
    const link = screen.getByRole('link', { name: /6 cities logo/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', AppRoute.Main);
  });

  it('should render logo image with correct attributes', () => {
    renderWithRouter(<Footer />);
    const img = screen.getByAltText('6 cities logo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('logo.svg'));
    expect(img).toHaveAttribute('width', '64');
    expect(img).toHaveAttribute('height', '33');
  });

  it('should be memoized', () => {
    expect(Footer).toHaveProperty('type');
  });
});
