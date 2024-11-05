import { createSlice } from '@reduxjs/toolkit';
import { DialogState } from "../interfaces/chat.interfaces";

const initialState: DialogState = {
    isDialogVisible: true,
};

export const dialogSlice = createSlice({
    name: 'dialog',
    initialState,
    reducers: {
        hideDialog: (state) => {
            state.isDialogVisible = true;
        },
        showDialog: (state) => {
            state.isDialogVisible = false;
        }
    },
})

export const { hideDialog, showDialog } = dialogSlice.actions

export default dialogSlice.reducer