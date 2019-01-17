import React, { Component } from 'react';
import ProductGroup from './product-group';
import './bulk-order-form.css';


export default class BulkOrderForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: []
        }

        this.updateQuantity = (quantity, id) => {
            const products = [...this.state.products];
            quantity = parseInt(quantity);
            if (quantity >= 0) {
                products.forEach(product => {
                    product.id === id ? product.quantity = quantity : null
                });
                this.setState({
                    products: products,
                    message: ''
                })
            }
        }
        this.addToCart = (e) => {
            const button = e.target;
            const lineItems = this.state.products.map(product => {
                if (product.quantity > 0) {
                    return {
                        productId: product.id,
                        quantity: product.quantity
                    }
                }
            }).filter(item => item != null);
        
            if (lineItems.length > 0) {
                button.disabled = true;
                this.setState({message: "Adding items to your cart..."});

                fetch(`/api/storefront/cart`)
                .then(response => response.json())
                .then(cart => {
                    if(cart.length > 0) {
                        return addToExistingCart(cart[0].id)
                    } else {
                        return createNewCart()
                    }
                })
                .then(() => window.location = "/cart.php")
                .catch(err => handleFailedAddToCart(err, this, button))
            } else {
                this.setState({message: "Please select a quantity for at least 1 item"});
            }

            async function createNewCart() {
                const response = await fetch(`/api/storefront/carts`, {
                    credentials: "include",
                    method: "POST",
                    body: JSON.stringify({ lineItems: lineItems })
                });
                const data = await response.json();
                if (!response.ok) {
                    return Promise.reject("There was an issue adding items to your cart. Please try again.")
                } else {
                    console.log(data);
                }
            }

            async function addToExistingCart(cart_id) {
                const response = await fetch(`/api/storefront/carts/${cart_id}/items`, {
                    credentials: "include",
                    method: "POST",
                    body: JSON.stringify({ lineItems: lineItems })
                });
                const data = await response.json();
                if (!response.ok) {
                    return Promise.reject("There was an issue adding items to your cart. Please try again.")
                } else {
                    console.log(data);
                }
            }

            function handleFailedAddToCart(message, self,  button) {
                self.setState({
                    message: message
                });
                return button.disabled = false;
            }
        }
    }

    componentDidMount() {
        let keys = Object.keys(this.props);
        let categoryProducts = []
        keys.forEach(key => {
            key != 'children' ? categoryProducts.push(this.props[key]) : null
        });
        this.setState({products: categoryProducts})
    }

    render() {
        return (
            <div>
                <ProductGroup 
                    products={this.state.products}
                    updateQuantity={this.updateQuantity}
                    addToCart={this.addToCart}
                    message={this.state.message}/>
            </div>
        )
    }
}
