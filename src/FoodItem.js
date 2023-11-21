import React from 'react';
import { Card } from 'react-bootstrap';

function FoodItem({ item }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>
          Quantity: {item.quantity}
          <br />
          Expiry: {item.expiryDate}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default FoodItem;
