import { NameSpace } from '../../const';
import { State } from '../../types/state';

export const getSelectedSorting = (state: State): string => state[NameSpace.Sorting].selectedSorting;
