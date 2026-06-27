import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OfferInside } from './offer-inside';
import type { OfferType } from '../../types/offer';

describe('OfferInside', () => {
  const createMockOffer = (goods: string[]): OfferType => ({
    id: 'offer-1',
    title: 'Test Offer',
    type: 'apartment',
    price: 100,
    city: { name: 'Paris', location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 } },
    location: { latitude: 48.8566, longitude: 2.3522, zoom: 12 },
    isFavorite: false,
    isPremium: false,
    rating: 4,
    description: 'Test description',
    bedrooms: 2,
    goods,
    host: { name: 'John', avatarUrl: 'avatar.jpg', isPro: false },
    images: ['image1.jpg'],
    maxAdults: 4,
  });

  it('должен корректно отображать заголовок', () => {
    const offer = createMockOffer(['Wi-Fi']);
    render(<OfferInside offer={offer} />);

    expect(screen.getByText('What\'s inside')).toBeInTheDocument();
    expect(screen.getByText('What\'s inside')).toHaveClass('offer__inside-title');
  });

  it('должен отображать список удобств', () => {
    const offer = createMockOffer(['Wi-Fi', 'Kitchen', 'Washing machine']);
    render(<OfferInside offer={offer} />);

    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Washing machine')).toBeInTheDocument();
  });

  it('должен рендерить правильное количество элементов списка', () => {
    const offer = createMockOffer(['Wi-Fi', 'Kitchen', 'Washing machine', 'Heating']);
    render(<OfferInside offer={offer} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('должен иметь правильные CSS классы', () => {
    const offer = createMockOffer(['Wi-Fi']);
    const { container } = render(<OfferInside offer={offer} />);

    const insideContainer = container.querySelector('.offer__inside');
    expect(insideContainer).toBeInTheDocument();

    const title = container.querySelector('.offer__inside-title');
    expect(title).toBeInTheDocument();

    const list = container.querySelector('.offer__inside-list');
    expect(list).toBeInTheDocument();

    const listItem = container.querySelector('.offer__inside-item');
    expect(listItem).toBeInTheDocument();
  });

  it('должен корректно обрабатывать пустой массив goods', () => {
    const offer = createMockOffer([]);
    const { container } = render(<OfferInside offer={offer} />);

    const list = container.querySelector('.offer__inside-list');
    expect(list).toBeInTheDocument();
    expect(list?.children.length).toBe(0);
  });

  it('должен корректно обрабатывать одно удобство', () => {
    const offer = createMockOffer(['Wi-Fi']);
    render(<OfferInside offer={offer} />);

    expect(screen.getByText('Wi-Fi')).toBeInTheDocument();
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(1);
  });

  it('должен корректно обрабатывать много удобств', () => {
    const goods = ['Wi-Fi', 'Kitchen', 'Washing machine', 'Heating', 'Cable TV', 'Dishwasher', 'Crib'];
    const offer = createMockOffer(goods);
    render(<OfferInside offer={offer} />);

    goods.forEach((good) => {
      expect(screen.getByText(good)).toBeInTheDocument();
    });

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(goods.length);
  });

  it('должен иметь правильную структуру DOM', () => {
    const offer = createMockOffer(['Wi-Fi', 'Kitchen']);
    const { container } = render(<OfferInside offer={offer} />);

    const insideContainer = container.querySelector('.offer__inside');
    expect(insideContainer?.tagName).toBe('DIV');

    const title = insideContainer?.querySelector('h2');
    expect(title).toBeInTheDocument();

    const list = insideContainer?.querySelector('ul');
    expect(list).toBeInTheDocument();

    const listItems = list?.querySelectorAll('li');
    expect(listItems?.length).toBe(2);
  });

  it('должен отображать удобства в правильном порядке', () => {
    const goods = ['Wi-Fi', 'Kitchen', 'Washing machine'];
    const offer = createMockOffer(goods);
    render(<OfferInside offer={offer} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).toHaveTextContent('Wi-Fi');
    expect(listItems[1]).toHaveTextContent('Kitchen');
    expect(listItems[2]).toHaveTextContent('Washing machine');
  });
});
