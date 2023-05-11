import { useContext } from 'react';
import type { AppContextValue } from 'contexts/AppContext';
import AppContext from 'contexts/AppContext';

const useApp = (): AppContextValue => useContext(AppContext);

export default useApp;
