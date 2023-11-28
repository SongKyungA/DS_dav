// src //ModifyItemModal.js

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { modifyItem } from './redux/actions';

function ModifyItemModal({ show, handleClose, onModifyItem, selectedItemToModify, selectedCategory }) {
    // Initialize itemDetails with the selected item to modify
    const [itemDetails, setItemDetails] = useState({});

    useEffect(() => {
      if (show && selectedItemToModify) {
        setItemDetails(selectedItemToModify);
      }
    }, [show, selectedItemToModify]);

    const handleDetailChange = (e) => {
      const { name, value } = e.target;
      setItemDetails(prevItemDetails => ({ ...prevItemDetails, [name]: value }));
    };

    // handleModify 함수 내부 로직
    const handleModify = () => {
      const itemId = selectedItemToModify.name;
      if (!itemId) {
        console.error('No item selected for modification');
        return;
      }
      console.log('Modifying item with details:', itemDetails);
      onModifyItem(selectedCategory.name, itemId, itemDetails);
      handleClose();
    };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Modify Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Units</Form.Label>
            <Form.Control
              type="number"
              name="units"
              value={itemDetails.units || 0}
              onChange={handleDetailChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Good Until</Form.Label>
            <Form.Control
              type="date"
              name="goodUntil"
              value={itemDetails.goodUntil}
              onChange={handleDetailChange}
            />
          </Form.Group>
          {/* Add any additional fields for item details here */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" onClick={handleModify}>Modify</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default connect(null, { onModifyItem: modifyItem })(ModifyItemModal);
