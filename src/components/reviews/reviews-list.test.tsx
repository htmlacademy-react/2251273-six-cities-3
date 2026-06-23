import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReviewsList } from './reviews-list';
import { CommentElementType } from '../../types/comments';
import { convertRatingToStars } from '../../utils';

// Мокаем утилиту convertRatingToStars
vi.mock('../../utils', () => ({
  convertRatingToStars: vi.fn(),
}));

describe('ReviewsList', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    // Задаём возвращаемое значение для convertRatingToStars
    vi.mocked(convertRatingToStars).mockImplementation(
      (rating) => `${rating * 20}%`
    );
  });

  it('should render an empty list when no comments are provided', () => {
    render(<ReviewsList comments={[]} />);

    const list = document.querySelector('.reviews__list');
    expect(list).toBeInTheDocument();
    expect(list?.children).toHaveLength(0);

    // Проверяем, что нет элементов списка
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();

    // Убедимся, что convertRatingToStars не вызывалась
    expect(convertRatingToStars).not.toHaveBeenCalled();
  });

  it('should format date correctly using dayjs', () => {
    // Можно проверить корректность форматирования для другой даты,
    // но это уже покрыто предыдущим тестом.
    // Добавим проверку для одного комментария с другой датой.
    const singleComment: CommentElementType[] = [
      {
        id: '3',
        user: {
          name: 'Alice',
          avatarUrl: 'avatar3.jpg',
          isPro: false
        },
        rating: 3,
        comment: 'Not bad',
        date: '2023-12-25T08:30:00Z',
      },
    ];

    render(<ReviewsList comments={singleComment} />);
    const timeElement = document.querySelector('.reviews__time');
    expect(timeElement).toHaveAttribute('datetime', '2023-12-25');
    expect(timeElement).toHaveTextContent('December 2023');
  });

  it('should apply the correct width style based on rating', () => {
    // Проверяем, что ширина соответствует рейтингу для конкретного отзыва
    const comment: CommentElementType[] = [
      {
        id: '4',
        user: {
          name: 'Bob',
          avatarUrl: 'avatar4.jpg',
          isPro: false
        },
        rating: 3.5,
        comment: 'Average',
        date: '2023-01-01T00:00:00Z',
      },
    ];

    vi.mocked(convertRatingToStars).mockReturnValue('70%');

    render(<ReviewsList comments={comment} />);
    const starsSpan = document.querySelector('.rating__stars span');
    expect(starsSpan).toHaveStyle('width: 70%');
    expect(convertRatingToStars).toHaveBeenCalledWith(3.5);
  });
});
