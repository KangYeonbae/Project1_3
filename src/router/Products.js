import React from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';
import {useNavigate} from "react-router-dom";


const products = [
    {
        id: 1,
        name: 'Zero Waste Product 1',
        price: 10000,
        image: '/img/zeroshop1.jpg'
    },
    {
        id: 2,
        name: 'Zero Waste Product 2',
        price: 20000,
        image: '/img/zeroshop2.jpg'
    },
    {
        id: 3,
        name: 'Zero Waste Product 3',
        price: 30000,
        image: '/img/zeroshop3.jpg'
    }
];

function Products({ setUserInfo }) {
    const navigate = useNavigate();
    const handlePurchase = async (product) => {
        try {
            const response = await axios.post('http://localhost:3001/purchase', {
                productId: product.id,
                price: product.price
            }, { withCredentials: true });

            if (response.status === 200) {
                alert('구매가 완료되었으며 마일리지가 적립되었습니다.');

                const userInfoResponse = await axios.get('http://localhost:3001/mypage', { withCredentials: true });
                setUserInfo({
                    nickname: userInfoResponse.data.NICKNAME,
                    realname: userInfoResponse.data.REALNAME,
                    mileage: userInfoResponse.data.MILEAGE
                });
                navigate('/mypage'); // 구매 후 마이페이지로 리디렉션
            }
        } catch (error) {
            console.error('Failed to purchase:', error.response ? error.response.data : error.message);
            alert('구매에 실패했습니다.');
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Zero Waste Shop
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={product.image}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography variant="h5">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Price: {product.price} KRW
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => handlePurchase(product)}>
                                    구매
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Products;