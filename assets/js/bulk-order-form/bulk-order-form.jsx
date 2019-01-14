import React, { Component } from 'react';
import ProductGroup from './product-group';
import './bulk-order-form.css';


export default class BulkOrderForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            products: []
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
        console.log(this.state)
        return (
            <div>
                <ProductGroup 
                  products={this.state.products}
                />
            </div>
        )
    }
}
