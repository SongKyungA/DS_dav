// src //RemoveItemModal.js

import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { removeItem } from './redux/actions';

function RemoveItemModal({ show, handleClose, onRemoveItem, selectedItemToRemove, selectedCategory }) {

  // handleRemove 함수 내부 로직
  const handleRemove = () => {
    const itemId = selectedItemToRemove.name;
    if (!itemId) {
      console.error('No item selected for removal');
      return;
    }
    console.log('Removing item:', selectedItemToRemove);
    onRemoveItem(selectedCategory.name, itemId);
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
            <Form.Label>Are you sure you want to remove the item: {selectedItemToRemove.name}?</Form.Label>
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
