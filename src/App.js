import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addItem as addItemAction, removeItem, modifyItem } from './redux/actions';
import { Container, Row, Col, Button, Card, ProgressBar } from 'react-bootstrap';
import './App.css';
import AddItemModal from './AddItemModal';

function App({ categories, addItem, removeItem, modifyItem }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleAddItem = (category) => {
    setSelectedCategory(category);
  };

  const handleRemoveItem = categoryName => removeItem(categoryName);
  const handleModifyItem = itemId => modifyItem(itemId);
  const viewRecipes = () => {
    console.log('View recipes functionality not implemented yet.');
  };

  const totalCapacity = 100;
  const usedCapacity = categories.reduce((sum, category) => sum + category.count, 0);
  const capacityPercentage = (usedCapacity / totalCapacity) * 100;

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItemDetails, setNewItemDetails] = useState({
    name: '',
    units: 0,
    placedIn: '',
    goodUntil: '',
    icon: ''
  });

  const handleItemDetailChange = (e) => {
    const { name, value } = e.target;
    setNewItemDetails({ ...newItemDetails, [name]: value });
  };

  const handleShowAddItemModal = () => {
    setShowAddItemModal(true);
  };

  const handleHideAddItemModal = () => {
    setShowAddItemModal(false);
  };

  const handleAddNewItem = () => {
    // 아이템의 아이콘 경로를 포함하여 addItem 액션 디스패치
    addItem({ ...newItemDetails, icon: `/icons8_80/png/${newItemDetails.icon}.png` });
    handleHideAddItemModal();
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="sidebar">
          {categories.map(category => (
            <Card key={category.name} onClick={() => handleAddItem(category)}>
              <Card.Body style={{ backgroundColor: category.color }}>
                <Card.Title>{category.name}</Card.Title>
                <Card.Text>{category.count} items</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col md={10} className="main-content">
          <div className="dashboard-header">
            <h1 style={{ textAlign: 'left', fontSize: '36px' }}>{currentTime.toLocaleTimeString()}</h1>
            <p style={{ textAlign: 'left', fontSize: '20px' }}>7°C / Cloudy</p>
          </div>
          <div className="user-message" style={{ textAlign: 'left', fontSize: '20px' }}>
            <p>Good evening!</p>
            <p><br /></p>
            <p>You are advised to throw out your avocado, asparagus,</p>
            <p>sausage, clam, cliced bread, and sandwich</p>
            <p> - these items are probably expired.</p>
            <p><br /></p>
            <p>You seem to have alot of fruits and vegetables right now.</p>
            <p>How about making a healthy avocado BLT salad?</p>
          </div>

          {selectedCategory && (
            <Row className="category-items">
              {selectedCategory.items.map((item, index) => (
                <Col key={index} xs={6} md={4} lg={3}>
                  <Card>
                    <Card.Img variant="top" src={require(`./icons8_80/png/${item.icon}.png`)} />
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>Units: {item.units}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <ProgressBar now={capacityPercentage} label={`${capacityPercentage.toFixed(0)}%`} />
          <Row>
            <Col md={6}>
              <Button variant="outline-primary" block style={{ fontWeight: 'bold', width: '100%', height: '100px', fontSize: '24px' }} onClick={handleShowAddItemModal}>ADD ITEM</Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-secondary" block style={{ fontWeight: 'bold', width: '100%', height: '100px', fontSize: '24px' }} onClick={() => handleRemoveItem('Fruit')}>REMOVE ITEM</Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-success" block style={{ fontWeight: 'bold', width: '100%', height: '100px', fontSize: '24px' }} onClick={() => handleModifyItem(1)}>MODIFY ITEM</Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-info" block style={{ fontWeight: 'bold', width: '100%', height: '100px', fontSize: '24px' }} onClick={viewRecipes}>RECIPES</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <AddItemModal 
        show={showAddItemModal} 
        handleClose={handleHideAddItemModal}
        onAddNewItem={handleAddNewItem}
        itemDetails={newItemDetails}
        onItemDetailChange={handleItemDetailChange}
      />
    </Container>
  );
}

const mapStateToProps = state => ({
  categories: state.categories
});

const mapDispatchToProps = {
  addItem: addItemAction,
  removeItem,
  modifyItem
};

export default connect(mapStateToProps, mapDispatchToProps)(App);