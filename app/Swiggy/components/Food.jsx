import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleMenuVisibility } from "@/utils/slice/ToggleSlice";
import { addItem, updateQuantity, clearCart } from "@/utils/slice/foodCartSlice";
import item from "@/app/api/nearbyResturant/FoodItems/items";
const WarningModal = ({ isOpen, onConfirm, onCancel, currentRestaurant, newRestaurant }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Change Restaurant?
        </h3>
        <p className="text-gray-600 mb-6">
          You already have items in your cart from {currentRestaurant}. Adding items from {newRestaurant} will clear your current cart.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Cart & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const Food = (props) => {
  const dispatch = useDispatch();
  const [showWarning, setShowWarning] = useState(false);
  const [pendingItem, setPendingItem] = useState(null);
  
  const { items } = useSelector((state) => state.foodCart);

  const toggleMenu = () => {
    dispatch(toggleMenuVisibility());
  };

  const getCurrentRestaurant = () => {
    if (items.length > 0) {
      const firstItem = items[0];
      return firstItem.place;
    }
    return null;
  };

  const handleAddItem = (foodItem) => {
    const currentRestaurant = getCurrentRestaurant();
    const newItemRestaurant = `${props.resName} ${props.resAddress}`;

    if (currentRestaurant && currentRestaurant !== newItemRestaurant) {
      setShowWarning(true);
      setPendingItem(foodItem);
      return;
    }

    addItemToCart(foodItem);
  };

  const addItemToCart = (foodItem) => {
    const existingItem = items.find((cartItem) => cartItem.id === foodItem.id);

    if (existingItem) {
      dispatch(
        updateQuantity({
          id: foodItem.id,
          quantity: Number(existingItem.quantity) + Number(1),
        })
      );
    } else {
      dispatch(
        addItem({
          id: foodItem.id,
          name: foodItem.itemName,
          price: Number(foodItem.price),
          quantity: 1,
          place: `${props.resName} ${props.resAddress}`
        })
      );
    }
  };

  const handleWarningConfirm = () => {
    dispatch(clearCart());
    if (pendingItem) {
      addItemToCart(pendingItem);
    }
    setShowWarning(false);
    setPendingItem(null);
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
    setPendingItem(null);
  };

  const getItemQuantity = (itemId) => {
    const existingItem = items.find((cartItem) => cartItem.id === itemId);
    return existingItem ? existingItem.quantity : 0;
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <button 
          className="p-4 text-gray-600 hover:text-gray-900" 
          onClick={toggleMenu}
        >
          <i className="ri-close-large-line"> Close</i>
        </button>

        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{props.resName}</h2>
          <p className="text-gray-600">{props.resAddress}</p>
        </div>

        <div className="divide-y divide-gray-200">
          {item.map((foodItem, index) => (
            <div key={index} className="p-6 flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {foodItem.itemName}
                </h3>
                <p className="text-gray-600">{foodItem.description}</p>
                <div className="mt-2">
                  <span className="text-yellow-500">{foodItem.ratings}</span>
                  <span className="ml-2 text-gray-500">
                    ({foodItem.reviews} reviews)
                  </span>
                </div>
              </div>
              <div className="ml-6 flex flex-col items-center">
                <img 
                  src={foodItem.image} 
                  alt={foodItem.itemName}
                  className="w-24 h-24 object-cover rounded-lg mb-2"
                />
                <button
                  onClick={() => handleAddItem(foodItem)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {getItemQuantity(foodItem.id) > 0
                    ? `In Cart: ${getItemQuantity(foodItem.id)}`
                    : "ADD"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <WarningModal
        isOpen={showWarning}
        onConfirm={handleWarningConfirm}
        onCancel={handleWarningCancel}
        currentRestaurant={getCurrentRestaurant()}
        newRestaurant={`${props.resName} ${props.resAddress}`}
      />
    </>
  );
};

export default Food;