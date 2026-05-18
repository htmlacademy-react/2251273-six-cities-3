// Import Store ( Импорт хранилища )
import { store } from '../store/store';

// Create State ( Создание типа состояния )
export type State = ReturnType<typeof store.getState>;
// Create Dispatch ( Создание типа диспатча )
export type AppDispatch = ReturnType<typeof store.dispatch>;
