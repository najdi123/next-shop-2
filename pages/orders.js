import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
    const [orders1, setOrders] = useState([]);
    useEffect(() => {
        axios.get('/api/orders').then(response => {
            setOrders(response.data);
        });
    }, []);
    const orders = [
        {
            createdAt: '12324353423431',
            line_items: [{
                price_data: { product_data: { name: 'jhfg' } },
                quantity: 4,
            }, {
                price_data: { product_data: { name: 'asd' } },
                quantity: 4,
            }],
            name: 'User 1',
            email: 'asd@asd.asd',
            city: 'Tehran',
            postalCode: '112321321',
            streetAddress: 'asd efw fsfwef',
            country: 'Iran',
            paid: true,
        },
        {
            line_items: [{
                price_data: { product_data: { name: 'asd' } },
                quantity: 4,
            }],
            name: 'User 2',
            email: 'asd@asd.asd',
            city: 'Tehran',
            postalCode: '112321321',
            streetAddress: 'asd efw fsfwef',
            country: 'Iran',
            paid: false,
        },
        {
            line_items: [{
                price_data: { product_data: { name: 'rere' } },
                quantity: 4,
            }],
            name: 'User 3',
            email: 'asd@asd.asd',
            city: 'Tehran',
            postalCode: '112321321',
            streetAddress: 'asd efw fsfwef',
            country: 'Iran',
            paid: true,
        },
        {
            line_items: [{
                price_data: { product_data: { name: 'rere' } },
                quantity: 4,
            }],
            name: 'User 4',
            email: 'asd@asd.asd',
            city: 'Tehran',
            postalCode: '112321321',
            streetAddress: 'asd efw fsfwef',
            country: 'Iran',
            paid: true,
        }
    ]
    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr key={order._id}>
                            <td>{(new Date(order.createdAt)).toLocaleString()}
                            </td>
                            <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
                                {order.paid ? 'YES' : 'NO'}
                            </td>
                            <td>
                                {order.name} {order.email}<br />
                                {order.city} {order.postalCode} {order.country}<br />
                                {order.streetAddress}
                            </td>
                            <td>
                                {order.line_items.map(l => (
                                    <>
                                        {l.price_data?.product_data.name} x
                                        {l.quantity}<br />
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
