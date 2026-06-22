import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfferMark } from './offer-mark'; // путь может отличаться

describe('OfferMark', () => {
  it('renders without crashing', () => {
    render(<OfferMark />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
  });

  it('has the correct class name on the outer div', () => {
    render(<OfferMark />);
    const divElement = screen.getByText('Premium').closest('div');
    expect(divElement).toHaveClass('offer__mark');
  });

  it('renders the correct text inside span', () => {
    render(<OfferMark />);
    const spanElement = screen.getByText('Premium');
    expect(spanElement.tagName).toBe('SPAN');
    expect(spanElement).toHaveTextContent('Premium');
  });

  it('matches snapshot', () => {
    const { container } = render(<OfferMark />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
