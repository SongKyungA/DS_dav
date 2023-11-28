//src//App.js
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addItem as addItemAction, removeItem, modifyItem } from './redux/actions';
import { Container, Row, Col, Button, Card, ProgressBar } from 'react-bootstrap';
import './App.css';
import AddItemModal from './AddItemModal';
import RemoveItemModal from './RemoveItemModal';
import ModifyItemModal from './ModifyItemModal';

import { MdEco } from 'react-icons/md';

function App({ categories, addItem, removeItem, modifyItem }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItemName, setSelectedItemName] = useState(''); // 추가
  const [selectedItemToModify, setSelectedItemToModify] = useState(null);

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const handleAddItem = (category) => {
    setSelectedCategory(category);
    console.log("handleAddItem - Selected Category:", category.name);
  };
  
  const viewRecipes = () => {
    console.log('Opening recipes visualization.');
    window.open(window.location.origin + '/complete_recipe_visualization.html', '_blank');
  };

  const totalCapacity = 100;
  const usedCapacity = categories.reduce((sum, category) => sum + category.count, 0);
  const capacityPercentage = (usedCapacity / totalCapacity) * 100;

  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showRemoveItemModal, setShowRemoveItemModal] = useState(false);
  const [showModifyItemModal, setShowModifyItemModal] = useState(false);
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
      console.log("Showing modal for category:", selectedCategory);
      setShowAddItemModal(true);
    };

    const handleHideAddItemModal = () => {
      setShowAddItemModal(false);
    };
    
    const handleShowRemoveItemModal = (itemName) => {
      setSelectedItemName(itemName); 
      setShowRemoveItemModal(true);
    };
    const handleHideRemoveItemModal = () => setShowRemoveItemModal(false);
    const handleSelectItemToModify = (item) => {
      setSelectedItemToModify(item);
      setShowModifyItemModal(true);
    };
    
    const handleShowModifyItemModal = () => {
      if (!selectedItemToModify) {
        alert('Please select an item to modify.');
        return;
      }
      setShowModifyItemModal(true);
    };
  
  const handleHideModifyItemModal = () => setShowModifyItemModal(false);
  const handleAddNewItem = () => {
    if (selectedCategory) {
      console.log("Adding item to category:", selectedCategory.name); 
      addItem({
        category: selectedCategory.name,
        itemDetails: {
          ...newItemDetails,
        },
        units: newItemDetails.units
      });
      handleHideAddItemModal();
      setNewItemDetails({ name: '', units: 1, placedIn: '', goodUntil: '', icon: '' });
    } else {
      console.error("No category selected");
    }
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
          
          <h1 style={{ textAlign: 'center', fontSize: '46px' }}>
            <MdEco /> GSDS Eco-Friendly Refrigeration!
          </h1>            
            <h1 style={{ textAlign: 'right', fontSize: '36px' }}>{currentTime.toLocaleTimeString()}</h1>
            <p style={{ textAlign: 'right', fontSize: '20px' }}>7°C / Cloudy</p>
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
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>Units: {item.units}</Card.Text>
                      <div className="item-action-buttons">
                        <Button onClick={() => handleShowRemoveItemModal(item.name)}>Remove</Button>
                        <Button onClick={() => handleSelectItemToModify(item)}>Modify</Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <ProgressBar now={capacityPercentage} label={`${capacityPercentage.toFixed(0)}%`} />
          <Row>
            <Col md={6}>
              <Button variant="outline-success" block style={{ fontWeight: 'bold', width: '100%', height: '100px', fontSize: '24px' }} onClick={handleShowAddItemModal}>ADD ITEM</Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-success" block style={{ fontWeight: 'bold', width: '100%', height: '100px', fontSize: '24px' }} onClick={() => handleShowRemoveItemModal('Fruit')}>REMOVE ITEM</Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-success" block style={{ fontWeight: 'bold', width: '100%', height: '100px', fontSize: '24px' }} onClick={() => handleShowModifyItemModal}>MODIFY ITEM</Button>
            </Col>
            <Col md={6}>
              <Button variant="outline-success" block style={{ fontWeight: 'bold', width: '100%', height: '100px', fontSize: '24px' }} onClick={viewRecipes}>RECIPES</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      
      {showAddItemModal && (
      <AddItemModal 
        show={showAddItemModal}
        onHide={() => setShowAddItemModal(false)} 
        handleClose={handleHideAddItemModal}
        onAddNewItem={handleAddNewItem}
        itemDetails={newItemDetails}
        onItemDetailChange={handleItemDetailChange}
        selectedCategory={selectedCategory}
      />)}

      {showRemoveItemModal && (
      <RemoveItemModal 
        show={showRemoveItemModal} 
        handleClose={handleHideRemoveItemModal}
        onRemoveItem={removeItem}
        selectedCategory={selectedCategory}
      />)}

      {showModifyItemModal && (
      <ModifyItemModal 
        show={showModifyItemModal} 
        onHide={() => setShowModifyItemModal(false)}
        itemToModify={selectedItemToModify}
        handleClose={handleHideModifyItemModal}
        onModifyItem={modifyItem}
        selectedItemToModify={selectedItemToModify}
        selectedCategory={selectedCategory}
      />)}

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