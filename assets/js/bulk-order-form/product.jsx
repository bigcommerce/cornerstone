import React from 'react';

const Product = (props) => {
    const {name, image, price, quantity} = props;
    return (
            <div className='bulk-form-row'>
            <div className='bulk-form-col'>
                <img src={image} className='bulk-product-image'/>
            </div>
            <div className='bulk-form-col'>{name}</div>
            <div className='bulk-form-col'>{price}</div>
            <div className='bulk-form-col'>{quantity}</div>
            </div>
           )
}

export default Product;
