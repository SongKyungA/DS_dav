// src //RemoveItemModal.js

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { removeItem } from './redux/actions';

function RemoveItemModal({ show, handleClose, onRemoveItem, selectedCategory }) {
  const [selectedItemId, setSelectedItemId] = useState('');

  const handleItemSelection = (e) => {
    setSelectedItemId(e.target.value);
  };

  const handleRemove = () => {
    if (!selectedCategory || !selectedItemId) {
      console.error('No category or item selected');
      return;
    }
    // 여기서 selectedItemId는 제거하려는 아이템의 이름입니다.
    onRemoveItem(selectedCategory.name, selectedItemId);
    handleClose();
  };
  

  return (
    <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
        <Modal.Title>Remove Item</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
        <Form.Group>
            <Form.Label>Select Item to Remove</Form.Label>
            <Form.Control as="select" value={selectedItemId} onChange={handleItemSelection}>
            <option value="">Select an item</option>
            {selectedCategory && selectedCategory.items.map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
            ))}
            </Form.Control>
        </Form.Group>
        </Form>
  </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="danger" onClick={handleRemove}>Remove</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default connect(null, { onRemoveItem: removeItem })(RemoveItemModal);
