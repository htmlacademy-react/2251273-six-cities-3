// OfferInside.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OfferInside } from './offer-inside';
import type { OfferType } from '../../types/offer';

// Подключаем jest-dom matchers (если не настроены глобально)
import '@testing-library/jest-dom/vitest';

describe('OfferInside', () => {
  // Моковый объект offer для тестов
  const mockOffer: OfferType = {
    // Предполагаем, что в OfferType есть обязательные поля, добавляем минимально необходимые
    id: '1',
    title: 'Test offer',
    // ... другие поля, которые не используются в компоненте, можно пропустить,
    // но если TypeScript требует, добавим заглушки (зависит от реального типа)
    // Для простоты добавим только goods
    goods: ['Wi-Fi', 'Heating', 'Kitchen', 'Parking'],
    // Если требуется больше полей, можно добавить их как any или заполнить
  } as OfferType; // Используем as для упрощения, но лучше создать полный объект

  it('renders the title correctly', () => {
    render(<OfferInside offer={mockOffer} />);
    const title = screen.getByText(/What's inside/i);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass('offer__inside-title');
  });

  it('renders the correct number of goods items', () => {
    render(<OfferInside offer={mockOffer} />);
    const items = screen.getAllByRole('listitem'); // Все <li> внутри списка
    expect(items).toHaveLength(mockOffer.goods.length);
  });

  it('renders each good text', () => {
    render(<OfferInside offer={mockOffer} />);
    mockOffer.goods.forEach((good) => {
      expect(screen.getByText(good)).toBeInTheDocument();
    });
  });

  it('renders list items with correct classes and keys', () => {
    const { container } = render(<OfferInside offer={mockOffer} />);
    const list = container.querySelector('.offer__inside-list');
    expect(list).toBeInTheDocument();

    const items = container.querySelectorAll('.offer__inside-item');
    expect(items).toHaveLength(mockOffer.goods.length);

    // Проверяем, что ключи соответствуют формату `${good + index}`
    // (проверить ключи напрямую через DOM нельзя, но можно убедиться, что элементы отрендерены)
    // Для этого достаточно проверить, что каждый элемент имеет правильный класс и текст.
    items.forEach((item, index) => {
      expect(item).toHaveClass('offer__inside-item');
      expect(item.textContent).toBe(mockOffer.goods[index]);
    });
  });

  it('renders empty list when goods array is empty', () => {
    const emptyOffer = { ...mockOffer, goods: [] };
    render(<OfferInside offer={emptyOffer} />);
    const list = screen.getByRole('list'); // <ul> имеет неявную роль list
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(0);
    // Заголовок всё равно отображается
    expect(screen.getByText(/What's inside/i)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<OfferInside offer={mockOffer} />);
    expect(container).toMatchSnapshot();
  });
});
