// src/redux/actions.js
import { ADD_ITEM, REMOVE_ITEM, MODIFY_ITEM } from './actionTypes';

export const addItem = (categoryName, itemDetails) => ({
  type: ADD_ITEM,
  payload: { category: categoryName, itemDetails, units: itemDetails.units }
});

export const removeItem = (categoryName) => ({
  type: REMOVE_ITEM,
  payload: categoryName
});

export const modifyItem = (itemId) => ({
  type: MODIFY_ITEM,
  payload: itemId
});
