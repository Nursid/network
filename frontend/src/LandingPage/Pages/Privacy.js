import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar';
import Header from '../../Components/Header';
import Card from 'react-bootstrap/Card';
import Footer from '../../Components/Footer';
import PlumberBanner from '../../assets/img/PlumberBanner.jpg'
import CarWashingBanner from '../../assets/img/CarWashingBanner.jpg'
import SalonBanner from '../../assets/img/SalonBanner.jpg'
import ElectricBanner from '../../assets/img/ElectricBanner.jpg'

const Privacy = () => {
    // State to keep track of the current image index
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Array of image URLs
    const images = [
        PlumberBanner,
        CarWashingBanner,
        SalonBanner,
        ElectricBanner
    ];

    useEffect(() => {
        // Function to handle the timer
        const timer = setInterval(() => {
            // Increment the current image index
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); // Change the image every 5 seconds

        // Cleanup the timer when the component is unmounted
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Navbar />
            <Header />

            <section>

                {/* Hero section with a rotating background image */}
                <div
                    style={{
                        backgroundImage: `linear-gradient(62deg, #14257289 100%, #eedb30a8 0%), url(${images[currentImageIndex]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'top',
                        width: '100%',
                        height: '50vh',
                        backgroundColor: 'transparent',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    className="container-fluid"
                >
                    <div className="container" style={{ display: 'grid', placeItems: 'center', height: '500px' }}>
                        <Card className="bg-transparent text-center ServiceBanner p-2">
                            <h1 className="display-3 font-weight-bold text-warning">Privacy & Policy</h1>
                            <span className="text-white font-weight-bold">Home &#62; Privacy & Policy</span>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="">
                <div className="container-fluid PrivcyAndPolicyBanner">
                    <div className=''>
                        <div style={{ background: '#eedc30', color: "#142572" }} className='text-center p-3'>
                           
                        </div>
                        <div className='p-4'>
                            <p className='py-2'>
                               
                            </p>
                            <p className='py-2'>
                               
                            </p>
                            <p className='py-2'>
                                
                            </p>
                        </div>
                    </div>

                </div>
            </section>
            <section style={{ background: '#4b5ced' }}>
                {/* Footer section */}
                <div className="container-fluid privacyAndpolicyPadding">
                    <Footer reqrem={'reqremFor'} paddingForm={'paddingForm'} />
                </div>
            </section>
        </>
    );
};

export default Privacy;
