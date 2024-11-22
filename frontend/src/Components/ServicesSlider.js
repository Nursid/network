import React from 'react';
import Slider from 'react-slick';
import { Card, CardMedia, Typography } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { isMobile } from 'react-device-detect';

const ServicesSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div className='text-center'>
            <div style={{ backgroundColor: '#eedc30', color: '#142572', padding: '20px' }}>
                <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight={800}>Welcome to </Typography>
            </div>
            <Slider {...settings} className='py-2'>
                <div >
                    <Card sx={{ background: '#3d5ce8', maxWidth: 800, padding: 1, boxShadow: 'none' }}>
                        <img
                            style={{ height: 350 }}
                            className='w-100'
                            src="/wireless-router.jpg"
                            title="green iguana"
                        />
                    </Card>
                </div>
                <div>
                    <Card sx={{ background: '#3d5ce8', maxWidth: 800, padding: 1, boxShadow: 'none' }}>
                        <img
                            style={{ height: 350 }}
                            className='w-100'
                            src="/wireless-router.jpg"
                            title="green iguana"
                        />
                    </Card>
                </div>
                <div>
                    <Card sx={{ background: '#3d5ce8', maxWidth: 800, padding: 1, boxShadow: 'none' }}>
                        <img
                            style={{ height: 350 }}
                            className='w-100'
                            src="/wireless-router.jpg"
                            title="green iguana"
                        />
                    </Card>
                </div>

                <div>
                    <Card sx={{ background: '#3d5ce8', maxWidth: 800, padding: 1, boxShadow: 'none' }}>
                        <img
                            style={{ height: 350 }}
                            className='w-100'
                            src="/wireless-router.jpg"
                            title="green iguana"
                        />
                    </Card>
                </div>
                <div>
                    <Card sx={{ background: '#3d5ce8', maxWidth: 800, padding: 1, boxShadow: 'none' }}>
                        <img
                            style={{ height: 350 }}
                            className='w-100'
                            src="/wireless-router.jpg"
                            title="green iguana"
                        />
                    </Card>
                </div>
            </Slider>
        </div>
    );
};

export default ServicesSlider;
