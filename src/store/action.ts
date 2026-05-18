// Import Create Action
import { createAction } from '@reduxjs/toolkit';
// Create Actions
export const changeCity = createAction<string>('changeCity');
export const resetCity = createAction<void>('resetCity');
