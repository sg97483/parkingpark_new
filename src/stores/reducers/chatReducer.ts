import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface chatState {
  firebaseUsers?: any[];
  idChatRoom: string;
}

const initialState: chatState = {
  idChatRoom: '',
};

const chatSlice = createSlice({
  name: 'chatReducer',
  initialState,
  reducers: {
    clearChatReducer: () => initialState,
    cacheFirebaseUsers: (state, action: PayloadAction<any[]>) => {
      state.firebaseUsers = action.payload;
    },
    cacheIdChatRoom: (state, action: PayloadAction<string>) => {
      state.idChatRoom = action.payload;
    },
  },
});

export const {cacheFirebaseUsers, cacheIdChatRoom, clearChatReducer} = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
