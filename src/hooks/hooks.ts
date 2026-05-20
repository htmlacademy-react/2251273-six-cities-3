// Import React Redux
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// Import Types
import type { State, AppDispatch } from '../types/state';

// Create Hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
