import React from "react";

const Product = (props) => {
    const {name, product_id, image, price, quantity, updateQuantity} = props;
    return (
        <div className="bulk-form-row">
            <div className="bulk-form-col">
                <img src={image} className="bulk-product-image"/>
            </div>
            <div className="bulk-form-col">{name}</div>
            <div className="bulk-form-col">{price}</div>
            <div className="bulk-form-col">
                <div className="form-increment">
                <button className="button button--icon" onClick={() => updateQuantity(quantity - 1, product_id)}>
                    <span className="is-srOnly">Decrease Quantity:</span>
                    <i className="icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" id="icon-keyboard-arrow-down" width="100%" height="100%"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"></path></svg>
                    </i>
                </button>
                <input type="text" className="form-input form-input--incrementTotal" value={quantity} onChange={(e) => {updateQuantity(e.target.value, product_id)}}></input>
                <button className="button button--icon" onClick={() => updateQuantity(quantity + 1, product_id)}>
                    <span className="is-srOnly">Increase Quantity:</span>
                    <i className="icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" id="icon-keyboard-arrow-up" width="100%" height="100%"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path></svg>
                    </i>
                </button>
                </div>
            </div>
        </div>
    )
}

export default Product;