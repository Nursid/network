import React from 'react';
import Card from 'react-bootstrap/Card';

import { useNavigate } from 'react-router';
import { Col, Row } from 'reactstrap';
import { API_URL } from '../config';
import { Typography } from '@mui/material';
import { useService } from '../Store/context/serviceProvider';
const SecondSection = ({ data }) => {

    const navigate = useNavigate()
    const { setItems } = useService();
 
        const handleServiceSubmit = (id) => {
            setItems(id);
            navigate('/ServicePage');
        };
   


    return (
        <div id='services' className="bgColour text-center pt-3 pb-4">
            <div className="text-center pb-3">
                <Typography variant='h4' sx={{ color: '#142572' }} fontWeight={800}>Our Services</Typography>
                <Typography variant='h6' fontWeight={700} className='sketchFamily'>Get our services at minimum cost in a required time at the best deal possible with granted good work.</Typography>
            </div>
            <div className='bgColour'>
                <div className="bgSecondSectionImg">
                    <Row className="g-4 pb-4">
                        {/* {data.data && data.data.map((item, index) => (
                            <Col xs={6} md={6} lg={data.data && data.data.length >= 5 ? 2 : 4} xl={data.data && data.data.length >= 5 ? 2 : 4} style={{ maxWidth: '100%' }} key={index}>
                                <Card className='p-2 cardHover' onClick={() => HandleServiceSubmit(item.serviceName)} style={{ height: '16rem' }}>
                                    <div className="border">
                                        <img className='w-100' height={150} src={API_URL + "/uploads/" + item.icon} />
                                        <Card.Body>
                                            <Card.Title>{item.serviceName}</Card.Title>
                                        </Card.Body>
                                    </div>
                                </Card>
                            </Col>
                        ))} */}
                        {/* {PrimaryServices.map((item, index) => (
                            <Col xs={6} md={6} lg={2} xl={2} style={{ maxWidth: '100%' }} key={index}>
                                <Card className='p-2 cardHover' onClick={() => handleServiceSubmit(item.id)} style={{ height: '16rem' }}>
                                    <div className="border">
                                        <img className='w-100' height={150} src={item.image} />
                                        <Card.Body>
                                            <Card.Title className='sketchFamily'>{item.serviceName}</Card.Title>
                                        </Card.Body>
                                    </div>
                                </Card>
                            </Col>
                        ))} */}
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default SecondSection;
