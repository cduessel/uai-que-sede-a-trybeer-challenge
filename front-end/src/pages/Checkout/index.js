import React, { useContext, useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import './index.css';
import AppContext from '../../context/AppContext';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CartItem from '../../components/cartItem';
import { postOrder } from '../../services/requestAPI';

const Checkout = (props) => {
  const [cartHere, setCartHere] = useState([]);
  // const [alertCompraFinalizada, setAlertCompraFinalizada] = useState('');
  const [rua, setRua] = useState();
  const [numero, setNumero] = useState();
  // const theToken = localStorage.getItem("token");
  const { history } = props;
  const {
    cart, setCart, alertCompraFinalizada, setAlertCompraFinalizada,
  } = useContext(AppContext);

  const zero = 0;
  const dois = 2;
  const cartSum = cart
    .reduce((acc, cv) => acc + cv.price * cv.quantity, zero)
    .toFixed(dois);
  const fullCart = cartSum > zero;

  useEffect(() => {
    setCartHere(cart);
  },
  [cart]);

  useEffect(() => {
    const el = document.getElementById('compra-finalizada');
    if (el && el.innerHTML !== '') {
      const tempoEspera = 1000;
      setTimeout(() => {
        if (history.location.pathname === '/checkout') {
          history.push('/products');
        }
      }, tempoEspera);
    }
  }, [alertCompraFinalizada, history]);

  if (!localStorage.getItem('token')) {
    return <Redirect to="/login" />;
  }
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const userData = { deliveryAddress: rua, deliveryNumber: numero };
    await postOrder(token, cart.filter((e) => e.quantity > zero), userData);
    localStorage.removeItem('cart');
    setCart([]);
    setAlertCompraFinalizada('Compra realizada com sucesso!');
    // <Redirect to="/products" />
    // tempo = setTimeout(() => {
    // }, tempoEspera);
    return true; // handleHandleSubmit
  };

  return (
    <div className="Checkout">
      <Header>Finalizar Pedido</Header>
      <span id="compra-finalizada">{ alertCompraFinalizada }</span>
      <div className="pedido">
        <h2 className="checkoutitle">Produtos no carrinho:</h2>
        <table className="cartItems">
          <tr className="legenda cartItem">
            <th className="qty">QUANTIDADE</th>
            <th className="name">PRODUTO</th>
            <th className="unit-price">PRE??O</th>
            <th className="total-product">TOTAL</th>
            <th className="button">EXCLUIR</th>
          </tr>
          <tr className="legenda-small cartItem">
            <th className="qty">QTD</th>
            <th className="name">PROD</th>
            <th className="unit-price">R$/Un</th>
            <th className="total-product">R$</th>
            <th className="button"> </th>
          </tr>
          {
            cartHere
              .map((item, index) => <CartItem key={ item.id } item={ item } index={ index } />)
          }
        </table>
      </div>
      <p data-testid="order-total-value" className="total">
        { `TOTAL: R$ ${cartSum.toString().replace('.', ',')}` }
      </p>
      { Number(cartSum) === zero ? <h1>N??o h?? produtos no carrinho</h1> : null }
      <div className="deliveryForm">
        <h2 className="checkoutitle">Endere??o de entrega:</h2>
        <div className="checkout-forms-inputs">
          <div className="inputs input-rua">
            <h4>Rua</h4>

            <input
              data-testid="checkout-street-input"
              type="text"
              name="rua"
              onChange={ ({ target: { value } }) => setRua(value) }
              /* value={ rua } */
            />
          </div>
          <div className="inputs input-numero">
            <h4>N??mero</h4>
            <input
              data-testid="checkout-house-number-input"
              type="number"
              name="numero"
              onChange={ ({ target: { value } }) => setNumero(Number(value)) }
              /* value={ numero } */
            />
          </div>
        </div>
      </div>
      <button
        // type="button"
        data-testid="checkout-finish-btn"
        className="finishBtn"
        type="submit"
        disabled={ !(rua && numero && fullCart) }
        onClick={ handleSubmit }
      >
        Finalizar Pedido
      </button>
      <Footer />
    </div>
  );
};

export default Checkout;

Checkout.propTypes = {
  history: propTypes.instanceOf(Object).isRequired,
};
