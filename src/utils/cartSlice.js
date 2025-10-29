import { createSlice } from "@reduxjs/toolkit";

// Each cart item shape: { id, name, price, imageId, quantity }
// price is in rupees (integer). quantity is integer >= 1.
const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
    },
    reducers: {
        addItem: (state, action) => {
            const { id, name, price, imageId } = action.payload || {};
            if (!id) return;
            const existing = state.items.find((it) => it.id === id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ id, name, price, imageId, quantity: 1 });
            }
        },
        incrementItem: (state, action) => {
            const id = action.payload;
            const it = state.items.find((x) => x.id === id);
            if (it) it.quantity += 1;
        },
        decrementItem: (state, action) => {
            const id = action.payload;
            const it = state.items.find((x) => x.id === id);
            if (it) {
                it.quantity -= 1;
                if (it.quantity <= 0) {
                    state.items = state.items.filter((x) => x.id !== id);
                }
            }
        },
        removeItem: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter((x) => x.id !== id);
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addItem, incrementItem, decrementItem, removeItem, clearCart } =
    cartSlice.actions;
export default cartSlice.reducer;