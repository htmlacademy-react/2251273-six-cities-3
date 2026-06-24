import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { OfferPage } from './offer-page';

describe('OfferPage', () => {

  it('должен рендерить компонент', () => {
    render(
      <Provider store={store}>
        <OfferPage />
      </Provider>
    );
    const mainPage = screen.getByRole('main');
    expect(mainPage).toBeInTheDocument();

    const offerSection = mainPage.querySelector('.offer');
    expect(offerSection).toBeInTheDocument();
    screen.debug();
  });
});
