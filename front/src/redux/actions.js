// src/redux/actions.js
import { ADD_ITEM, REMOVE_ITEM, MODIFY_ITEM, REMOVE_ITEMS } from './actionTypes';

export const addItem = (categoryName, itemDetails) => ({
  type: ADD_ITEM,
  payload: { category: categoryName, itemDetails, units: itemDetails.units }
});

export const removeItem = (categoryName, itemName) => ({
  type: REMOVE_ITEM,
  payload: { categoryName, itemName }
});

export const removeItems = (categoryName, itemsNamesToRemove) => ({
  type: REMOVE_ITEMS,
  payload: { categoryName, itemsNamesToRemove }
});

export const modifyItem = (categoryName, itemId, newItemDetails) => {
  console.log('Modifying item:', newItemDetails);
  return {
    type: MODIFY_ITEM,
    payload: { categoryName, itemId, newItemDetails }
  };
};