import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';
// import Footer from '../../components/footer';
import './index.css';
import CardOrder from '../../components/CardOrders';
import AdminSideBar from '../../components/admin sidebar';
import { getSales } from '../../services/requestAPI';

const OrderAdmin = (props) => {
  const [allOrders, setAllOrders] = useState([]);
  const token = localStorage.getItem('token');
  const { history } = props;

  useEffect(() => {
    if (!token) {
      history.push('/login');
    }
    async function fetchProducts() {
      try {
        const { data } = await getSales(token);
        setAllOrders(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
      return 'true';
    }
    fetchProducts();
  }, [token, history]);

  return (
    <div>
      <div className="Orders adminOrders"  /* style={ { display: 'flex', alignItems: 'stretch' } } */>
        <AdminSideBar />
        <div className="ordersList">
          <h2 className="checkoutitle">Pedidos Pendentes</h2>
          <div className="cartItems adminList">
            {
              allOrders
                .map((item, index) => <CardOrder key={ item.id } order={ item } index={ index } />)
            }
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default OrderAdmin;

OrderAdmin.propTypes = {
  history: propTypes.instanceOf(Object).isRequired,
};