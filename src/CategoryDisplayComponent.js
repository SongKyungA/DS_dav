// src/CategoryDisplayComponent.js
import React from 'react';
import { connect } from 'react-redux';

function CategoryDisplayComponent({ categories }) {
    return (
        <div>
            {categories.map((cat, index) => (
                <div key={index}>
                    {cat.name}: {cat.count}
                </div>
            ))}
        </div>
    );
}

const mapStateToProps = state => ({
    categories: state.categories
});

export default connect(mapStateToProps)(CategoryDisplayComponent);
