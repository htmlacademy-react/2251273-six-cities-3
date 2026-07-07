import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReviewsComments } from './reviews-comments';
import { CommentElementType } from '../../types/comments';

vi.mock('../../utils', () => ({
  convertRatingToStars: vi.fn((rating: number) => `${rating * 20}%`),
}));

vi.mock('dayjs', () => ({
  default: (date: string) => ({
    format: (formatStr: string) => {
      if (formatStr === 'YYYY-MM-DD') {
        return '2024-01-15';
      }
      if (formatStr === 'MMMM YYYY') {
        return 'January 2024';
      }
      return date;
    },
  }),
}));

const mockComments: CommentElementType[] = [
  {
    id: 'comment-1',
    date: '2024-01-15T12:00:00.000Z',
    user: {
      name: 'John Doe',
      avatarUrl: 'https://example.com/avatar1.jpg',
      isPro: false,
    },
    comment: 'Great place to stay!',
    rating: 5,
  },
  {
    id: 'comment-2',
    date: '2024-01-14T10:00:00.000Z',
    user: {
      name: 'Jane Smith',
      avatarUrl: 'https://example.com/avatar2.jpg',
      isPro: true,
    },
    comment: 'Nice experience overall',
    rating: 4,
  },
];

const renderReviewsComments = (comments: CommentElementType[] = mockComments) =>
  render(<ReviewsComments comments={comments} />);

describe('ReviewsComments', () => {
  it('should render empty list when no comments', () => {
    renderReviewsComments([]);

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list).toHaveClass('reviews__list');
    expect(list.children).toHaveLength(0);
  });

  it('should render list with comments', () => {
    renderReviewsComments();

    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(mockComments.length);
  });

  it('should render user avatar for each comment', () => {
    renderReviewsComments();

    const avatars = screen.getAllByAltText('Reviews avatar');
    expect(avatars).toHaveLength(mockComments.length);

    mockComments.forEach((comment, index) => {
      expect(avatars[index]).toHaveAttribute('src', comment.user.avatarUrl);
      expect(avatars[index]).toHaveAttribute('width', '54');
      expect(avatars[index]).toHaveAttribute('height', '54');
    });
  });

  it('should render user name for each comment', () => {
    renderReviewsComments();

    mockComments.forEach((comment) => {
      expect(screen.getByText(comment.user.name)).toBeInTheDocument();
    });
  });

  it('should render comment text for each comment', () => {
    renderReviewsComments();

    mockComments.forEach((comment) => {
      expect(screen.getByText(comment.comment)).toBeInTheDocument();
    });
  });

  it('should render rating stars for each comment', () => {
    renderReviewsComments();

    const ratingTexts = screen.getAllByText('Rating');
    expect(ratingTexts).toHaveLength(mockComments.length);

    ratingTexts.forEach((ratingText) => {
      expect(ratingText).toHaveClass('visually-hidden');
    });
  });

  it('should render formatted date for each comment', () => {
    renderReviewsComments();

    const dates = screen.getAllByText('January 2024');
    expect(dates).toHaveLength(mockComments.length);

    dates.forEach((dateElement) => {
      expect(dateElement).toHaveAttribute('datetime', '2024-01-15');
      expect(dateElement).toHaveClass('reviews__time');
    });
  });

  it('should render correct structure for each comment item', () => {
    renderReviewsComments();

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(mockComments.length);

    listItems.forEach((item) => {
      expect(item).toHaveClass('reviews__item');
      expect(item.querySelector('.reviews__user')).toBeInTheDocument();
      expect(item.querySelector('.reviews__info')).toBeInTheDocument();
      expect(item.querySelector('.reviews__rating')).toBeInTheDocument();
      expect(item.querySelector('.reviews__text')).toBeInTheDocument();
      expect(item.querySelector('.reviews__time')).toBeInTheDocument();
    });
  });

  it('should render single comment correctly', () => {
    renderReviewsComments([mockComments[0]]);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great place to stay!')).toBeInTheDocument();
    expect(screen.getByText('January 2024')).toBeInTheDocument();
  });

  it('should render comments in order they are provided', () => {
    renderReviewsComments();

    const userNames = screen.getAllByText(/John Doe|Jane Smith/);
    expect(userNames[0]).toHaveTextContent('John Doe');
    expect(userNames[1]).toHaveTextContent('Jane Smith');
  });
});
