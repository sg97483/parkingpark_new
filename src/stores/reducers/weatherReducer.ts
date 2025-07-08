import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CodeRegionProps} from '~constants/types';

interface WeatherState {
  codeRegion: {
    state: string;
    city: string;
    code: number | null;
  };
  weatherData: Record<string, string> | null;
}

const initialState: WeatherState = {
  codeRegion: {
    code: null,
    state: '',
    city: '',
  },
  weatherData: null,
};

const weatherSlice = createSlice({
  name: 'weatherReducer',
  initialState,
  reducers: {
    clearWeatherData: () => initialState,
    cacheCodeRegion: (state, action: PayloadAction<CodeRegionProps>) => {
      state.codeRegion = {
        city: action?.payload?.city,
        code: action?.payload?.code,
        state: action?.payload?.state,
      };
    },
    cacheWeatherData: (state, action: PayloadAction<Record<string, string>>) => {
      state.weatherData = action.payload;
    },
  },
});

export const {cacheCodeRegion, cacheWeatherData} = weatherSlice.actions;
const weatherReducer = weatherSlice.reducer;
export default weatherReducer;
