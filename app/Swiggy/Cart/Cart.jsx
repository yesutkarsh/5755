"use client"
import React , { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity, clearCart } from '@/utils/slice/foodCartSlice';
import CheckoutModal from './Component/CheckoutModal';
import { toggleCheckoutVisibility } from '@/utils/slice/ToggleSlice';

const ShoppingCart = () => {
  // Get cart state from Redux store
  const { items, totalPrice } = useSelector((state) => state.foodCart);
  const dispatch = useDispatch();

  // Handler for quantity updates
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };


  let checkout = useSelector((state) => state.foodMenu.isCheckoutVisible);
  const setCheckout = () => {
    dispatch(toggleCheckoutVisibility());
  };


  // Handler for removing items
  const handleRemoveItem = (id) => {
    dispatch(removeItem({ id }));
  };

  // Handler for clearing cart
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Handler for checkout
  const handleCheckout = () => {
    // This will be handled by the parent component as mentioned
    console.log('Proceeding to checkout with items:', items);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
        <i className="ri-shopping-cart-2-line text-6xl text-gray-400 mb-4"></i>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
        <p className="text-gray-500">Add some delicious items to your cart!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Cart Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              <i className="ri-delete-bin-line mr-2"></i>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex items-center">
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="text-gray-600">${item.price} each</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <span className="px-4 py-2 text-center min-w-[40px]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div>

                {/* Item Total */}
                <div className="w-24 text-right">
                  <p className="font-medium">${item.totalPrice.toFixed(2)}</p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-medium">Total</span>
            <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
          </div>

          <button onClickCapture={()=>setCheckout(true)}
            onClick={handleCheckout}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <i className="ri-shopping-bag-line"></i>
            Proceed to Checkout
          </button>
        </div>
      </div>
      {checkout? <CheckoutModal price={totalPrice}/> : null}
    </div>
  );
};

export default ShoppingCart;