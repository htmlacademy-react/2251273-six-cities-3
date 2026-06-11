import { TYPE_OF_ERROR } from '../const';

export type ErrorType = typeof TYPE_OF_ERROR[keyof typeof TYPE_OF_ERROR];
