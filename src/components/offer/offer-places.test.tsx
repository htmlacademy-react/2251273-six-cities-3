import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NearPlaces } from './offer-places';
import { useAppSelector } from '../../hooks/hooks';
import { getNearOffersLoadingStatus } from '../../store/selectors/offers-slice';
import { Card } from '../card/card';
import { OffersElementType } from '../../types/offers';

// Мокаем хуки и компоненты
vi.mock('../../hooks/hooks', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../card/card', () => ({
  Card: vi.fn(() => <div data-testid="card-mock">Card</div>),
}));

vi.mock('../message/message', () => ({
  Message: vi.fn(() => <div data-testid="message-mock">Message</div>),
}));

describe('NearPlaces', () => {
  const mockOffers = [
    { id: '1', title: 'Offer 1' },
    { id: '2', title: 'Offer 2' },
  ] as OffersElementType[]; // используем any для упрощения, можно типизировать

  const mockOnOfferHover = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render title, offers list and Message when loading is false', () => {
    // Мокаем селектор: загрузка завершена (false)
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === getNearOffersLoadingStatus) {
        return false;
      }
      return undefined;
    });

    render(
      <NearPlaces offers={mockOffers} onOfferHover={mockOnOfferHover} />
    );

    // Заголовок
    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();

    // Список карточек: должно быть столько же, сколько офферов
    const cards = screen.getAllByTestId('card-mock');
    expect(cards).toHaveLength(mockOffers.length);

    // Message должен быть
    expect(screen.getByTestId('message-mock')).toBeInTheDocument();

    // Проверяем, что Card был вызван с правильными пропсами для каждого оффера
    expect(Card).toHaveBeenCalledTimes(mockOffers.length);
    mockOffers.forEach((offer, index) => {
      expect(Card).toHaveBeenNthCalledWith(
        index + 1,
        expect.objectContaining({
          offer,
          onOfferHover: mockOnOfferHover,
        }),
        expect.anything() // для контекста
      );
    });
  });

  it('should render title and offers list but NOT Message when loading is true', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === getNearOffersLoadingStatus) {
        return true;
      }
      return undefined;
    });

    render(
      <NearPlaces offers={mockOffers} onOfferHover={mockOnOfferHover} />
    );

    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();

    const cards = screen.getAllByTestId('card-mock');
    expect(cards).toHaveLength(mockOffers.length);

    // Message НЕ должен быть
    expect(screen.queryByTestId('message-mock')).not.toBeInTheDocument();
  });

  it('should render empty list when no offers provided', () => {
    (useAppSelector as jest.Mock).mockImplementation((selector) => {
      if (selector === getNearOffersLoadingStatus) {
        return false;
      }
      return undefined;
    });

    render(
      <NearPlaces offers={[]} onOfferHover={mockOnOfferHover} />
    );

    expect(screen.getByText('Other places in the neighbourhood')).toBeInTheDocument();
    expect(screen.queryByTestId('card-mock')).not.toBeInTheDocument();
    expect(Card).not.toHaveBeenCalled();
    expect(screen.getByTestId('message-mock')).toBeInTheDocument();
  });

  it('should pass onOfferHover callback to each Card', () => {
    (useAppSelector as jest.Mock).mockReturnValue(false);

    render(
      <NearPlaces offers={mockOffers} onOfferHover={mockOnOfferHover} />
    );

    // Проверяем, что все вызовы Card получили колбэк
    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        onOfferHover: mockOnOfferHover,
      }),
      expect.anything()
    );
  });
});
