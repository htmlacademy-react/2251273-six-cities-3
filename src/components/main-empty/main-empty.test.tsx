import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MainEmpty } from './main-empty'; // путь к компоненту

describe('Component: MainEmpty', () => {
  it('should render correctly with all texts and classes', () => {
    render(<MainEmpty />);

    // Проверяем, что заголовок отображается
    const heading = screen.getByText('No places to stay available');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('B');
    expect(heading).toHaveClass('cities__status');

    // Проверяем описание
    const description = screen.getByText(
      'We could not find any property available at the moment in Dusseldorf'
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('cities__status-description');

    // Так как у section нет role, лучше использовать querySelector
    const sectionEl = document.querySelector('section.cities__no-places');
    expect(sectionEl).toBeInTheDocument();

    const wrapper = document.querySelector('div.cities__status-wrapper.tabs__content');
    expect(wrapper).toBeInTheDocument();
  });

  // Дополнительно: snapshot-тест (опционально)
  it('should match snapshot', () => {
    const { container } = render(<MainEmpty />);
    expect(container).toMatchSnapshot();
  });
});
