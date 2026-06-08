import { createSlice } from '@reduxjs/toolkit';
import { NameSpace } from '../../const';
import { ErrorSliceType } from '../../types/slice/error-slice';
import { setErrorType, setErrorMessage } from '../action';

const initialState: ErrorSliceType = {
  errorType: null,
  errorMessage: null,
};

export const errorSlice = createSlice({
  name: NameSpace.City,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(setErrorType, (state, action) => {
        state.errorType = action.payload;
      })
      .addCase(setErrorMessage, (state, action) => {
        state.errorMessage = action.payload;
      });
  },
});
