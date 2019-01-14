import React from 'react';
import Product from './product';

const ProductGroup = (props) => {
    const productRows = props.products.map((product, index) => {
        return (
            <Product 
              key={index}
              name={product.name}
              image={product.image}
              price={product.price}
              quantity={product.quantity}
            />
        )
    });

    return (
        <div className='bulk-form-field'>
            <div className='bulk-form-row'>
                <div className='bulk-form-col'></div>
                <div className='bulk-form-col'><strong>Product</strong></div>
                <div className='bulk-form-col'><strong>Price</strong></div>
                <div className='bulk-form-col'><strong>Quantity</strong></div>
            </div>
            { productRows }
            <div className='cart-row'>
                <div className='bulk-form-col'></div>
                <button className='button button--primary bulk-add-cart'>Add to Cart</button>
            </div>
        </div>
    )
}

export default ProductGroup;

