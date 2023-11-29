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
  const [selectedItemToRemove, setSelectedItemToRemove] = useState(null); // 추가
  const [selectedItemToModify, setSelectedItemToModify] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [showRemoveModifyButtons, setShowRemoveModifyButtons] = useState(false);

  const handleCardClick = (item) => {
    if (selectedItemDetails === item) {
      // 같은 아이템을 다시 클릭하면 상세 정보와 버튼 숨기기
      setSelectedItemDetails(null);
      setShowRemoveModifyButtons(false);
    } else {
      // 다른 아이템을 클릭하면 상세 정보 표시 및 버튼 보이기
      setSelectedItemDetails(item);
      setShowRemoveModifyButtons(true);
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedCategory(categories[0]);
      console.log(categories[0])
    }
  }, [categories]);

  const handleAddItem = (category) => {
    setSelectedCategory(category);
    console.log("handleAddItem - Selected Category:", category.name);
  };
  
  const viewFoodTop10 = () => {
    console.log('Opening Food Top 10 visualization.');
    window.open(window.location.origin + '/complete_recipe_visualization.html', '_blank');
  };

  const viewCirclePackingFood = () => {
    console.log('Circle Packing Food visualization not implemented yet.');
    // Circle package food 시각화 tool 추가 예정
  };

  const viewRecipes = () => {
    console.log('Recipes functionality not implemented yet.');
    // 레시피 기능을 추가할 예정
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

  const handleShowAddItemModal = () => {
    console.log("Showing modal for category:", selectedCategory);
    setShowAddItemModal(true);
  };

  const handleHideAddItemModal = () => {
    setShowAddItemModal(false);
  };

  const handleRemoveItem = () => {
    // Remove 버튼 클릭 시 수행할 작업 추가
    handleSelectItemToRemove(selectedItemDetails);
  };
  
  const handleSelectItemToRemove = (item) => {
    setSelectedItemToRemove(item);
    setShowRemoveItemModal(true);
  };

  const handleShowRemoveItemModal = () => {
    if (!selectedItemToRemove) {
      alert('Please select an item to remove.');
      return;
    }
    setShowRemoveItemModal(true); 
  };
  const handleHideRemoveItemModal = () => setShowRemoveItemModal(false);

  const handleModifyItem = () => {
    // Modify 버튼 클릭 시 수행할 작업 추가
    handleSelectItemToModify(selectedItemDetails);
  };

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
                  <Card onClick={() => handleCardClick(item)}>
                    <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start'  }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>                        
                        <div>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>Units: {item.units}</Card.Text>
                        </div>
                        {item.icon && (
                          <div style={{ marginLeft: 'auto' }}>
                            <img src={item.icon} alt="Item Icon" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                          </div>
                        )}
                      </div>
                    
                    {/* Additional information and actions displayed on card click */}
                    {selectedItemDetails === item && (
                      <div>
                        <Card.Text>Good Until: {item.goodUntil}</Card.Text>
                        {showRemoveModifyButtons && (
                          <div className="item-action-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <Button onClick={handleRemoveItem}>Remove</Button>
                            <Button onClick={handleModifyItem}>Modify</Button>
                          </div>
                        )}
                      </div>
                    )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <ProgressBar now={capacityPercentage} label={`${capacityPercentage.toFixed(0)}%`} />
          <Row>
            <Col md={4}>
              <Button variant="outline-success" block style={buttonStyle} onClick={handleShowAddItemModal}>ADD ITEM</Button>
            </Col>
            <Col md={4}>
              <Button variant="outline-danger" block style={buttonStyle} onClick={() => handleShowRemoveItemModal}>REMOVE ITEM</Button>
            </Col>
            <Col md={4}>
              <Button variant="outline-warning" block style={buttonStyle} onClick={() => handleShowModifyItemModal}>MODIFY ITEM</Button>
            </Col>
          </Row>
          <p><br /></p>
          <Row>
            <Col md={4}>
              <Button variant="outline-info" block style={buttonStyle} onClick={viewFoodTop10}>FOOD TOP 10</Button>
            </Col>
            <Col md={4}>
              <Button variant="outline-primary" block style={buttonStyle} onClick={viewCirclePackingFood}>CIRCLE PACKING FOOD</Button>
            </Col>
            <Col md={4}>
              <Button variant="outline-secondary" block style={buttonStyle} onClick={viewRecipes}>RECIPES</Button>
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
        selectedItemToRemove = {selectedItemToRemove}
        selectedCategory={selectedCategory}
      />)}

      {showModifyItemModal && (
      <ModifyItemModal 
        show={showModifyItemModal} 
        handleClose={handleHideModifyItemModal}
        onModifyItem={modifyItem}
        selectedItemToModify={selectedItemToModify}
        selectedCategory={selectedCategory}
      />)}

    </Container>
  );
}

const buttonStyle = { 
  fontWeight: 'bold', 
  width: '100%', 
  height: '100px', 
  fontSize: '24px'
};

const mapStateToProps = state => ({
  categories: state.categories
});

const mapDispatchToProps = {
  addItem: addItemAction,
  removeItem,
  modifyItem
};

export default connect(mapStateToProps, mapDispatchToProps)(App);