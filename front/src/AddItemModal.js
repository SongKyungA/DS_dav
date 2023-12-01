// src //AddItemModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addItem } from './redux/actions';

import { db } from './firebase'
import { collection, getDocs } from "firebase/firestore"; 

function AddItemModal({ show, handleClose, onAddNewItem, itemDetails, onItemDetailChange, selectedCategory }) {
  const today = new Date();
  const formattedToday = today.toISOString().substring(0, 10);
  
  const [item, setItem] = useState({ name: '', units: 1, placedIn: formattedToday, goodUntil: formattedToday, icon: '' });
  const [foodNames, setFoodNames] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    console.log('AddItemModal - Selected Category:', selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const loadFoodNamesFromFirestore = async () => {
        try {
            const foodCollection = await getDocs(collection(db, "food"));
            const loadedFoodNames = foodCollection.docs.map(doc => ({
                name: doc.id,
                url: doc.data().url,
            }));
            setFoodNames(loadedFoodNames);
            console.log('Loaded Food Names:', loadedFoodNames);
        } catch (error) {
            console.error('Error loading data from Firestore:', error);
        }
    };

    loadFoodNamesFromFirestore();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const selectedFood = foodNames.find(food => food.name === value);
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
      icon: selectedFood ? selectedFood.url : prevItem.icon,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // add 진행 시 item 선택하지 않으면 경고창 띄어주기
    if (item.name === '') {
      alert('Please select an item name.');
      return; 
    }
  
    if (!selectedCategory) {
      console.error('No category selected');
      return;
    }
    console.log('Selected Category in Modal:', selectedCategory.name);
    onAddNewItem(selectedCategory.name, {
      ...item
    });
    handleClose();
    setItem({ name: '', units: 1, placedIn: '', goodUntil: '', icon: ''  });
  };
  
  
  
  

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
        <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Control as="select" name="name" value={item.name} onChange={handleChange} onInput={handleSearch}>
            <option value="">Select an item</option>
            {foodNames
              .filter((food) =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((food) => (
                <option key={food.name} value={food.name}>
                  {food.name}
                </option>
            ))}
            </Form.Control>
        </Form.Group>
        {item.icon && (
          <div>
            <p>Selected Image:</p>
            <img src={item.icon} alt="Selected Item" style={{ maxWidth: '100px', maxHeight: '100px' }} />
          </div>
        )}
          <Form.Group>
            <Form.Label>Units</Form.Label>
            <Form.Control type="number" name="units" value={item.units} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Placed In</Form.Label>
            <Form.Control type="date" name="placedIn" value={item.placedIn} onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Good Until</Form.Label>
            <Form.Control type="date" name="goodUntil" value={item.goodUntil} onChange={handleChange} />
          </Form.Group>          
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default connect(null, { onAddNewItem: addItem })(AddItemModal);
