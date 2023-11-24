// src/redux/reducers.js
import { ADD_ITEM, REMOVE_ITEM, MODIFY_ITEM } from './actionTypes';

const initialState = {
  categories: [
    { name: 'Fruit 🥝', items: [], count: 0, color: 'rgba(255, 99, 132, 0.2)' },
    { name: 'Vegetable 🥬', items: [], count: 0, color: 'rgba(75, 192, 192, 0.2)' },
    { name: 'Meat 🍖', items: [], count: 0, color: 'rgba(255, 159, 64, 0.2)' },
    { name: 'Seafood 🍤', items: [], count: 0, color: 'rgba(54, 162, 235, 0.2)' },
    { name: 'Dairy/Eggs 🍳', items: [], count: 0, color: 'rgba(255, 205, 86, 0.2)' }, 
    { name: 'Grains 🥚', items: [], count: 0, color: 'rgba(153, 102, 255, 0.2)' },  
    { name: 'Banchan 🧆', items: [], count: 0, color: 'rgba(255, 102, 255, 0.2)' },  
    { name: 'Fastfood 🍔', items: [], count: 0, color: 'rgba(255, 77, 77, 0.2)' },
    { name: 'Drink 🍺', items: [], count: 0, color: 'rgba(255, 115, 77, 0.2)' },     
    { name: 'Other 🍱', items: [], count: 0, color: 'rgba(0, 128, 128, 0.2)' },    
  ]
};


const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM:
      console.log('Adding item:', action.payload.category);
      const { category: categoryName, itemDetails, units } = action.payload;
      const numericUnits = parseInt(units, 10);

      return {
        ...state,
        categories: state.categories.map(cat => {
          if (cat.name === categoryName) {
            return {
              ...cat,
              items: [...cat.items, itemDetails],
              count: cat.count + numericUnits
            };
          }
          return cat;
        })
      };

      case REMOVE_ITEM:
        return {
          ...state,
          categories: state.categories.map(category => {
            if (category.name === action.payload.categoryName) {
              const itemsToRemove = category.items.filter(item => item.name === action.payload.itemName);
              const countToRemove = itemsToRemove.reduce((sum, item) => sum + item.units, 0);
              return {
                ...category,
                items: category.items.filter(item => item.name !== action.payload.itemName),
                count: category.count - countToRemove
              };
            }
            return category;
          })
        };
      
      

        case MODIFY_ITEM:
          return {
            ...state,
            categories: state.categories.map(category => {
              if (category.name === action.payload.categoryName) {
                return {
                  ...category,
                  items: category.items.map(item => 
                    item.id === action.payload.itemId ? { ...item, ...action.payload.newItemDetails } : item
                  ),
                };
              }
              return category;
            })
          };

    default:
      return state;
  }
};

export default rootReducer;
