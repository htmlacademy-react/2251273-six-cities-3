// OfferHost.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfferHost } from './offer-host';
import { getFirstName } from '../../utils';
import type { OfferType } from '../../types/offer';
import '@testing-library/jest-dom/vitest';

// Мокаем функцию getFirstName
vi.mock('../../utils', () => ({
  getFirstName: vi.fn(),
}));

describe('OfferHost', () => {
  // Базовый моковый объект offer
  const mockOffer: OfferType = {
    id: '1',
    title: 'Test offer',
    // ... другие поля, если обязательны
    host: {
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar.jpg',
      isPro: false,
    },
    description: 'This is a wonderful place to stay.',
    // Добавьте остальные поля, если они требуются типом (можно как any)
  } as OfferType;

  beforeEach(() => {
    vi.mocked(getFirstName).mockReset();
  });

  it('renders the host title', () => {
    render(<OfferHost offer={mockOffer} />);
    expect(screen.getByText('Meet the host')).toBeInTheDocument();
  });

  it('renders the first name using getFirstName', () => {
    const firstName = 'John';
    vi.mocked(getFirstName).mockReturnValue(firstName);

    render(<OfferHost offer={mockOffer} />);
    expect(screen.getByText(firstName)).toBeInTheDocument();
    expect(getFirstName).toHaveBeenCalledWith(mockOffer.host.name);
  });

  it('renders the avatar with correct attributes', () => {
    render(<OfferHost offer={mockOffer} />);
    const img = screen.getByAltText('Host avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockOffer.host.avatarUrl);
    expect(img).toHaveAttribute('width', '74');
    expect(img).toHaveAttribute('height', '74');
  });

  it('renders the description', () => {
    render(<OfferHost offer={mockOffer} />);
    expect(screen.getByText(mockOffer.description)).toBeInTheDocument();
  });

  it('does not render "Pro" status and pro class when host is not pro', () => {
    const offer = { ...mockOffer, host: { ...mockOffer.host, isPro: false } };
    render(<OfferHost offer={offer} />);

    // Статус Pro не должен быть
    expect(screen.queryByText('Pro')).not.toBeInTheDocument();

    // Класс pro не должен быть у обёртки аватара
    const avatarWrapper = document.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).not.toHaveClass('offer__avatar-wrapper--pro');
  });

  it('renders "Pro" status and pro class when host is pro', () => {
    const offer = { ...mockOffer, host: { ...mockOffer.host, isPro: true } };
    render(<OfferHost offer={offer} />);

    expect(screen.getByText('Pro')).toBeInTheDocument();
    const avatarWrapper = document.querySelector('.offer__avatar-wrapper');
    expect(avatarWrapper).toHaveClass('offer__avatar-wrapper--pro');
  });

  it('renders the correct classes for avatar wrapper', () => {
    render(<OfferHost offer={mockOffer} />);
    const wrapper = document.querySelector('.offer__avatar-wrapper');
    expect(wrapper).toHaveClass('offer__avatar-wrapper');
    expect(wrapper).toHaveClass('user__avatar-wrapper');
    // В зависимости от isPro может добавляться или нет --pro, проверяем базовое наличие
    expect(wrapper).toBeInTheDocument();
  });

  it('matches snapshot when host is not pro', () => {
    vi.mocked(getFirstName).mockReturnValue('John');
    const { container } = render(<OfferHost offer={mockOffer} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when host is pro', () => {
    vi.mocked(getFirstName).mockReturnValue('Jane');
    const proOffer = { ...mockOffer, host: { ...mockOffer.host, isPro: true } };
    const { container } = render(<OfferHost offer={proOffer} />);
    expect(container).toMatchSnapshot();
  });
});
