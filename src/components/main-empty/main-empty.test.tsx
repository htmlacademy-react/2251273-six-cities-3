import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MainEmpty } from './main-empty';

describe('MainEmpty', () => {
  it('должен корректно рендериться', () => {
    const { container } = render(<MainEmpty />);

    expect(container).toBeInTheDocument();
  });

  it('должен отображать заголовок "No places to stay available"', () => {
    render(<MainEmpty />);

    const statusText = screen.getByText('No places to stay available');
    expect(statusText).toBeInTheDocument();
    expect(statusText).toHaveClass('cities__status');
    expect(statusText.tagName).toBe('B');
  });

  it('должен отображать описание с названием города', () => {
    render(<MainEmpty />);

    const description = screen.getByText(/We could not find any property available at the moment in Dusseldorf/);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('cities__status-description');
    expect(description.tagName).toBe('P');
  });

  it('должен иметь правильные CSS классы для секции', () => {
    const { container } = render(<MainEmpty />);

    const section = container.querySelector('.cities__no-places');
    expect(section).toBeInTheDocument();
    expect(section?.tagName).toBe('SECTION');
  });

  it('должен иметь правильные CSS классы для wrapper', () => {
    const { container } = render(<MainEmpty />);

    const wrapper = container.querySelector('.cities__status-wrapper');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('tabs__content');
    expect(wrapper?.tagName).toBe('DIV');
  });

  it('должен иметь правильную структуру DOM', () => {
    const { container } = render(<MainEmpty />);

    const section = container.querySelector('.cities__no-places');
    expect(section).toBeInTheDocument();

    const wrapper = section?.querySelector('.cities__status-wrapper');
    expect(wrapper).toBeInTheDocument();

    const status = wrapper?.querySelector('.cities__status');
    expect(status).toBeInTheDocument();
    expect(status?.tagName).toBe('B');

    const description = wrapper?.querySelector('.cities__status-description');
    expect(description).toBeInTheDocument();
    expect(description?.tagName).toBe('P');
  });

  it('должен содержать название города Dusseldorf в описании', () => {
    render(<MainEmpty />);

    expect(screen.getByText(/Dusseldorf/)).toBeInTheDocument();
  });

  it('должен отображать только один элемент с заголовком', () => {
    render(<MainEmpty />);

    const statusElements = screen.getAllByText('No places to stay available');
    expect(statusElements).toHaveLength(1);
  });

  it('должен отображать только одно описание', () => {
    render(<MainEmpty />);

    const descriptions = screen.getAllByText(/We could not find any property available/);
    expect(descriptions).toHaveLength(1);
  });

  it('должен быть мемоизирован', () => {
    expect(MainEmpty.$$typeof).toBe(Symbol.for('react.memo'));
  });
});
