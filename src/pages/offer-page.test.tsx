import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { OfferPage } from './offer-page';

import { fetchOfferAction, fetchNearOffersAction } from '../store/api-actions';
import { setErrorType } from '../store/action';
import { getSelectedOffer, getSelectedOfferLoadingStatus } from '../store/selectors/offer-slice';
import { getNearOffers } from '../store/selectors/offers-slice';
import { AppRoute, TYPE_OF_ERROR } from '../const';
import { OffersElementType } from '../types/offers';

const { mockNavigate, mockDispatch, mockUseAppSelector } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockDispatch: vi.fn(),
  mockUseAppSelector: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ offerId: 'test-offer-id' }),
  };
});

vi.mock('../hooks/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: mockUseAppSelector,
}));

vi.mock('../store/api-actions', () => ({
  fetchOfferAction: vi.fn(),
  fetchNearOffersAction: vi.fn(),
}));

vi.mock('../store/action', () => ({
  setErrorType: vi.fn(),
}));

vi.mock('../store/selectors/offer-slice', () => ({
  getSelectedOffer: vi.fn(),
  getSelectedOfferLoadingStatus: vi.fn(),
}));

vi.mock('../store/selectors/offers-slice', () => ({
  getNearOffers: vi.fn(),
}));

vi.mock('../components/offer/offer-gallery', () => ({
  OfferGallery: () => <div data-testid="offer-gallery">Gallery</div>,
}));

vi.mock('../components/offer/offer', () => ({
  Offer: () => <div data-testid="offer">Offer Details</div>,
}));

vi.mock('../components/offer/offer-places', () => ({
  NearPlaces: ({ onOfferHover }: { onOfferHover?: (id: string) => void }) => (
    <div data-testid="near-places" onClick={() => onOfferHover && onOfferHover('hovered-id')}>
      Near Places
    </div>
  ),
}));

vi.mock('../components/map/map', () => ({
  Map: ({ currentOffer }: { currentOffer?: string }) => (
    <div data-testid="map">Map (current: {currentOffer})</div>
  ),
}));

vi.mock('../utils', () => ({
  getLocation: vi.fn(() => ({ name: 'test', center: [0, 0], zoom: 10 })),
  getRandomNearsOffers: vi.fn((offers: OffersElementType[]) => offers),
}));

const mockOffer = {
  id: 'test-offer-id',
  title: 'Test Offer',
  type: 'apartment',
  price: 100,
  city: { name: 'Paris', location: { latitude: 48.85, longitude: 2.35, zoom: 10 } },
  location: { latitude: 48.85, longitude: 2.35, zoom: 10 },
  isFavorite: false,
  isPremium: false,
  rating: 4,
  description: 'Test description',
  bedrooms: 2,
  goods: ['Wi-Fi'],
  host: { name: 'Host', avatarUrl: 'url', isPro: false },
  images: ['img1.jpg', 'img2.jpg'],
  maxAdults: 4,
  previewImage: 'preview.jpg',
};

const mockNearOffers: OffersElementType[] = [
  { ...mockOffer, id: 'near-1' },
  { ...mockOffer, id: 'near-2' },
];

const renderOfferPage = () => render(
  <MemoryRouter>
    <OfferPage />
  </MemoryRouter>
);

const setupSelectors = (overrides: {
  selectedOffer?: typeof mockOffer | null;
  nearOffers?: OffersElementType[];
  loadingStatus?: boolean;
} = {}) => {
  const config = {
    selectedOffer: mockOffer,
    nearOffers: mockNearOffers,
    loadingStatus: false,
    ...overrides,
  };

  mockUseAppSelector.mockImplementation((selector: unknown) => {
    if (selector === getSelectedOffer) {
      return config.selectedOffer;
    }
    if (selector === getNearOffers) {
      return config.nearOffers;
    }
    if (selector === getSelectedOfferLoadingStatus) {
      return config.loadingStatus;
    }
    return undefined;
  });
};

describe('OfferPage', () => {
  let unhandledRejectionHandler: (event: PromiseRejectionEvent) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve() });

    vi.mocked(fetchOfferAction).mockImplementation(() => ({
      unwrap: () => Promise.resolve(),
    }) as unknown as ReturnType<typeof fetchOfferAction>);

    vi.mocked(fetchNearOffersAction).mockImplementation(() => ({
      type: 'mock',
    }) as unknown as ReturnType<typeof fetchNearOffersAction>);

    vi.mocked(setErrorType).mockImplementation(() => ({
      type: 'mock',
    }) as unknown as ReturnType<typeof setErrorType>);

    unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
    };
    window.addEventListener('unhandledrejection', unhandledRejectionHandler);
  });

  afterEach(() => {
    window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
  });

  it('should render correctly when offer is loaded', () => {
    setupSelectors();
    renderOfferPage();

    expect(screen.getByTestId('offer-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('offer')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByTestId('near-places')).toBeInTheDocument();
  });

  it('should dispatch fetchOfferAction on mount', () => {
    setupSelectors();
    renderOfferPage();

    expect(fetchOfferAction).toHaveBeenCalledWith('test-offer-id');
  });

  it('should dispatch fetchNearOffersAction after successful fetch', async () => {
    setupSelectors();
    renderOfferPage();

    await waitFor(() => {
      expect(fetchNearOffersAction).toHaveBeenCalledWith('test-offer-id');
    });
  });

  it('should navigate to NotFound if fetching offer fails', async () => {
    setupSelectors({ selectedOffer: null });

    mockDispatch.mockReturnValueOnce({
      unwrap: () => Promise.reject(new Error('Not found')),
    });

    await act(async () => {
      renderOfferPage();
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(AppRoute.NotFound);
    });
  });

  it('should dispatch setErrorType if selectedOfferLoadingStatus is false', () => {
    setupSelectors({ loadingStatus: false });
    renderOfferPage();

    expect(setErrorType).toHaveBeenCalledWith(TYPE_OF_ERROR.ERROR_LOADING_OFFER);
  });

  it('should not dispatch setErrorType if selectedOfferLoadingStatus is true', () => {
    setupSelectors({ loadingStatus: true });
    renderOfferPage();

    expect(setErrorType).not.toHaveBeenCalled();
  });

  it('should pass correct props to Map component', () => {
    setupSelectors();
    renderOfferPage();

    const mapElement = screen.getByTestId('map');
    expect(mapElement).toHaveTextContent('current: test-offer-id');
  });

  it('should handle offer hover correctly', () => {
    setupSelectors();
    renderOfferPage();

    const nearPlaces = screen.getByTestId('near-places');
    fireEvent.click(nearPlaces);

    const mapElement = screen.getByTestId('map');
    expect(mapElement).toBeInTheDocument();
  });

  it('should not render offer components if selectedOffer is null', () => {
    setupSelectors({ selectedOffer: null });
    renderOfferPage();

    expect(screen.queryByTestId('offer-gallery')).not.toBeInTheDocument();
    expect(screen.queryByTestId('offer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('map')).not.toBeInTheDocument();
    expect(screen.queryByTestId('near-places')).not.toBeInTheDocument();
  });

  it('should render near places with random offers', () => {
    setupSelectors({ nearOffers: mockNearOffers });
    renderOfferPage();

    expect(screen.getByTestId('near-places')).toBeInTheDocument();
  });
});
