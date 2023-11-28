// src //AddItemModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { addItem } from './redux/actions';

function AddItemModal({ show, handleClose, onAddNewItem, itemDetails, onItemDetailChange, selectedCategory }) {
  const today = new Date();
  const formattedToday = today.toISOString().substring(0, 10);
  
  const [item, setItem] = useState({ name: '', units: 1, placedIn: '', goodUntil: formattedToday, category: '' });
  const [foodNames, setFoodNames] = useState([]);
  
  useEffect(() => {
    console.log('AddItemModal - Selected Category:', selectedCategory);
  }, [selectedCategory]);
  
  useEffect(() => {
    // 이 부분에서 CSV 파일의 데이터를 로드합니다. 실제 구현은 프로젝트의 구조에 따라 달라질 수 있습니다.
    // 예를 들어, 서버에서 데이터를 가져오거나 프로젝트 내의 로컬 파일에서 로드할 수 있습니다.
    // 여기서는 간단한 예시를 위해 직접 데이터를 명시하겠습니다.
    const loadedFoodNames = ['apple', 'apricot', 'asparagus', 'avocado', 'bacon', /* ... 다른 항목들 ... */];
    setFoodNames(loadedFoodNames);
  }, []);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!selectedCategory) {
      console.error('No category selected');
      return;
    }
    console.log('Selected Category in Modal:', selectedCategory.name);
    // selectedCategory의 이름을 onAddNewItem 함수에 전달합니다.
    onAddNewItem(selectedCategory.name, {
      ...item
    });
    handleClose();
    setItem({ name: '', units: 1, placedIn: '', goodUntil: '' });
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
            <Form.Control as="select" name="name" value={item.name} onChange={handleChange}>
            <option value="">Select an item</option>
            {foodNames.map(name => (
            <option key={name} value={name}>{name}</option>
            ))}
            </Form.Control>
        </Form.Group>
          <Form.Group>
            <Form.Label>Units</Form.Label>
            <Form.Control type="number" name="units" value={item.units} onChange={handleChange} />
          </Form.Group>
          {/* Additional input fields can be added here */}
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
