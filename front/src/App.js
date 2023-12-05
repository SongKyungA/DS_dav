//src//App.js
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { addItem as addItemAction, removeItem, modifyItem } from './redux/actions';
import { Container, Row, Col, Button, Card, ProgressBar } from 'react-bootstrap';
import './App.css';
import AddItemModal from './AddItemModal';
import RemoveItemModal from './RemoveItemModal';
import ModifyItemModal from './ModifyItemModal';
import { removeItems } from './redux/actions';
import { Form } from 'react-bootstrap';
import { MdEco } from 'react-icons/md';
import TrendImage from './food-stock-trend.png';
import axios from 'axios';

function App({ categories, addItem, removeItem, modifyItem, removeItems }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHome, setIsHome] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItemToRemove, setSelectedItemToRemove] = useState(null);
  const [selectedItemToModify, setSelectedItemToModify] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [showRemoveModifyButtons, setShowRemoveModifyButtons] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (item, isChecked) => {
    setSelectedItems(prevSelectedItems => {
      if (isChecked) {
        return [...prevSelectedItems, item];
      } else {
        return prevSelectedItems.filter(selectedItem => selectedItem !== item);
      }
    });
  };

  const handleRemoveSelectedItems = () => {
    if (selectedItems.length === 0) {
      alert('Please select at least one item to remove.');
      return;
    }
  
  const confirmDelete = window.confirm('Are you sure you want to delete the selected items?');
    if (confirmDelete) {
      const itemNamesToRemove = selectedItems.map(item => item.name);
      removeItems(selectedCategory.name, itemNamesToRemove);
      setSelectedItems([]);
    } else {
      console.log('Item removal cancelled by user.');
    }
  };

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

  const viewRecipe = () => {
    window.open(window.location.origin +'/krecipe.html', '_blank');
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

  // 개발 1번 : Real time 기반
  const calculateOpacity = (placedIn, goodUntil) => {
    const placedDate = new Date(placedIn)
    const expiryDate = new Date(goodUntil);
    const currentDate = new Date();
    const ratio = expiryDate-placedDate == 0? 0: (expiryDate-currentDate)/(expiryDate-placedDate);
    console.log(ratio)

    // 남은 일 수에 따라 투명도를 계산
    const opacity = Math.max(0.1, ratio)
    // console.log('투명도:', opacity);
    return opacity;
  }

  // 개발 2번 : 초 단위 기반
  // const calculateOpacity = (placedIn) => {
  //   const placedDate = new Date(placedIn).getTime(); 
  //   const currentDate = Date.now();
  //   const elapsedSeconds = (currentDate - placedDate) / 1000;

    
  //   if (elapsedSeconds > 10) {
  //     return 0.2; 
  //   }
    
  //   const opacity = 1 - (elapsedSeconds * 0.08); 
  //   return Math.max(opacity, 0.2);
  // }  

  const [weatherData, setWeatherData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Get user's location
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
  
            // Fetch address details using reverse geocoding
            axios.get(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
            )
            .then((response) => {
              const borough = response.data.address.borough || response.data.address.county || '';

              setUserLocation(borough);
            })
            .catch((error) => {
              console.error('Error fetching address details:', error);
            });
  
            // Fetch weather data based on user's location
            axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.REACT_APP_OPENWEATHERMAP_API_KEY}`
            )
            .then((response) => {
              setWeatherData(response.data);
            })
            .catch((error) => {
              console.error('Error fetching weather data:', error);
            });
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
  
    fetchWeatherData(); // Call the function when the component mounts
  
    const timerId = setInterval(fetchWeatherData, 60000); // Refresh weather data every minute
    return () => clearInterval(timerId); // Clear the interval on component unmount
  }, []);

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
            <MdEco /> Home Refrigerator Fresh Food Tracker
          </h1>            
            <h1 style={{ textAlign: 'right', fontSize: '32px' }}>{currentTime.toLocaleTimeString()}</h1>
            {weatherData  && userLocation &&  (
              <p style={{ textAlign: 'right', fontSize: '20px' }}>
                {Math.round(weatherData.main.temp)}°C / {capitalizeFirstLetter(weatherData.weather[0].description)} ({userLocation})
              </p>
            )}
          </div>

          {isHome && (
          <div className="notification-box" style={{ textAlign: 'left', fontSize: '20px'}}>
            <p style={{ fontSize: '22px', fontWeight: 'bold' }}> Notifications </p>
            <div className="notification" style={{ textAlign: 'left', fontSize: '18px'}}>
              <p>3 food items will soon be <span style = {{fontWeight: 'bold', color: 'red'}}>expired: </span>
              Avocado, Broccoli, Sausage</p>
              <p style={{ textAlign: 'right', fontSize: '13px', fontStyle: 'italic', color:'ffffff'}}>12-05-2023</p>
            </div>
          </div>
          )}

          {isHome && (
            <div className="recent-summary" style={{ textAlign: 'left', fontSize: '20px' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold' }}>Recent Summary </p>
            <img src={TrendImage} alt="14-day trend" style={{ width: '100%', maxWidth: '800px'}}/>
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
                          <Form.Check 
                            type="checkbox"
                            checked={selectedItems.includes(item)}
                            onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                          />
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>Units: {item.units}</Card.Text>
                        </div>
                        {item.icon && (
                          <div style={{ marginLeft: 'auto' }}>
                            {/* 개발 1번 : Real time 기준 개발 version */}
                            <img 
                              src={item.icon} 
                              alt="Item Icon" 
                              style={{ 
                                maxWidth: '50px', 
                                maxHeight: '50px',
                                opacity: calculateOpacity(item.placedIn, item.goodUntil)
                              }} 
                            />
                            {/* 개발 2번 : 초 단위 개발 version */}
                            {/* <img 
                              src={item.icon} 
                              alt="Item Icon" 
                              style={{ 
                                maxWidth: '50px', 
                                maxHeight: '50px',
                                opacity: calculateOpacity(item.placedIn)
                              }} 
                            /> */}
                          </div>
                        )}
                      </div>
                    
                    {selectedItemDetails === item && (
                      <div>
                        <Card.Text  style={{ marginBottom: '0' }}>Placed In&nbsp;&nbsp;: {item.placedIn}</Card.Text>
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

          {/* Home 상태가 아닐 때만 아이템 관련 버튼을 표시합니다. */}
          {!isHome && (
            <Row>
              <Col md={4}>
                <Button variant="outline-success" block style={buttonStyle} onClick={handleShowAddItemModal}>ADD ITEM</Button>
              </Col>
              <Col md={4}>
                <Button variant="outline-danger" block style={buttonStyle} onClick={handleRemoveSelectedItems}>REMOVE ITEM</Button>
              </Col>
              <Col md={4}>
                <Button variant="outline-warning" block style={buttonStyle} onClick={viewRecipe}>RECIPE</Button>
              </Col>
            </Row>
          )}          
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
  modifyItem,
  removeItems
};

export default connect(mapStateToProps, mapDispatchToProps)(App);