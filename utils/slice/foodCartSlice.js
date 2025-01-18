import { createSlice } from "@reduxjs/toolkit";

const foodCartSlice = createSlice({
    name: "foodCart",
    initialState: {
        items: [], // Array to hold cart items
        totalPrice: 0, // Total price of items in the cart
    },
    reducers: {
        addItem: (state, action) => {
            const { id, name, price, quantity = 1, place } = action.payload;

            // Check if the item already exists in the cart
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                // Update quantity and total price for the existing item
                existingItem.quantity += quantity;
                existingItem.totalPrice += price * quantity;
            } else {
                // Add a new item to the cart
                state.items.push({
                    id,
                    name,
                    price,
                    quantity,
                    totalPrice: price * quantity,
                    place,
                });
            }

            // Update the total price of the cart
            state.totalPrice += price * quantity;
        },

        removeItem: (state, action) => {
            const { id } = action.payload;

            // Find the item to remove
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                // Deduct item's total price from cart total
                state.totalPrice -= existingItem.totalPrice;

                // Remove the item from the cart
                state.items = state.items.filter((item) => item.id !== id);
            }
        },

        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;

            // Find the item to update
            const existingItem = state.items.find((item) => item.id === id);

            if (existingItem) {
                // Update total price based on quantity change
                const priceDifference = (quantity - existingItem.quantity) * existingItem.price;
                existingItem.quantity = quantity;
                existingItem.totalPrice = quantity * existingItem.price;

                // Update the total cart price
                state.totalPrice += priceDifference;
            }
        },

        clearCart: (state) => {
            // Reset the cart
            state.items = [];
            state.totalPrice = 0;
        },
    },
});

// Export actions and reducer
export const { addItem, removeItem, updateQuantity, clearCart } = foodCartSlice.actions;
export default foodCartSlice.reducer;
