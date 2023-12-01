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
  const [isHome, setIsHome] = useState(true); // Home 상태 추가
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItemToRemove, setSelectedItemToRemove] = useState(null);
  const [selectedItemToModify, setSelectedItemToModify] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [showRemoveModifyButtons, setShowRemoveModifyButtons] = useState(false);

  const handleCardClick = (item) => {
    if (selectedItemDetails === item) {
      setSelectedItemDetails(null);
      setShowRemoveModifyButtons(false);
    } else {
      setSelectedItemDetails(item);
      setShowRemoveModifyButtons(true);
    }
  };

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const categoryExists = categories.find(c => c.name === selectedCategory.name);
      if (categoryExists) {
        setSelectedCategory(categoryExists);
      } else {
        setSelectedCategory(categories[0]);
      }
    }
  }, [categories, selectedCategory]);

  // Home 버튼 클릭 핸들러
  const handleHomeClick = () => {
    setIsHome(true);
    setSelectedCategory(null);
  };

  const handleAddItem = (category) => {
    setIsHome(false);
    setSelectedCategory(category);
  };
  
  const viewFoodTop10 = () => {
    console.log('Opening Food Top 10 visualization.');
    window.open(window.location.origin + '/complete_recipe_visualization.html', '_blank');
  };

  const viewCirclePackingFood = () => {
    console.log('Opening CirclePacking visualization.');
    window.open(window.location.origin + '/circle_packing.html', '_blank');
  };

  const viewUsers = () => {
    console.log('Opening Feedback Form.');
    window.open(window.location.origin + '/FeedbackForm.html', '_blank');
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

  const calculateOpacity = (placedIn, goodUntil) => {
    const placedDate = new Date(placedIn)
    const expiryDate = new Date(goodUntil);
    const currentDate = new Date();
    const ratio = expiryDate-placedDate == 0? 0: (expiryDate-currentDate)/(expiryDate-placedDate);
    console.log(ratio)

    if (expiryDate-currentDate < 0 ) {
      return 0.2; // 만료 날짜가 지났을 때 투명도를 20%로 설정
    }

    // 남은 일 수에 따라 투명도를 계산
    const opacity = Math.max(0.2, ratio)

    console.log('투명도:', opacity);
    return opacity;
  }

  return (
    <Container fluid>
      <Row>
      <Col md={2} className="sidebar">
        <Card onClick={handleHomeClick} className="category-card" style={{ backgroundColor: '#5F9F9F' }}>
          <Card.Body>
            <Card.Title style={{ color: 'white' }}>🏠 Home 🏠</Card.Title>
          </Card.Body>
        </Card>
        {categories.map(category => (
          <Card key={category.name} onClick={() => handleAddItem(category)} className={`category-card ${selectedCategory === category ? 'selected' : ''}`}>
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

          {isHome && (
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
          )}
          {selectedCategory && (
            <Row className="category-items">
              {selectedCategory.items.map((item, index) => (
                <Col key={index} xs={6} md={4} lg={3} style={{ marginBottom: '20px' }}>
                  <Card onClick={() => handleCardClick(item)}>
                    <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start'  }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>                        
                        <div>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>Units: {item.units}</Card.Text>
                        </div>
                        {item.icon && (
                          <div style={{ marginLeft: 'auto' }}>
                            <img 
                              src={item.icon} 
                              alt="Item Icon" 
                              style={{ 
                                maxWidth: '50px', 
                                maxHeight: '50px',
                                opacity: calculateOpacity(item.placedIn, item.goodUntil)
                              }} 
                            />
                          </div>
                        )}
                      </div>
                    
                    {/* Additional information and actions displayed on card click */}
                    {selectedItemDetails === item && (
                      <div>
                        <Card.Text>Placed In : {item.placedIn}</Card.Text>
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
          <div style={{ margin: '20px 0' }}>
            <ProgressBar now={capacityPercentage} label={`${capacityPercentage.toFixed(0)}%`} />
          </div>
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
              <Button variant="outline-secondary" block style={buttonStyle} onClick={viewUsers}>User Feedback</Button>
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