import React from 'react';
import Header from '../../Header/ClothesHeader';
import Footer from '../../../Utility/Footer';

function AirConditionersCoolers() {
    return (
        <div className='min-h-screen'>
            <Header />
            <div className='mt-24 mb-28 pb-20 px-4 flex flex-col items-center justify-center'>
                <h1 className='text-2xl font-bold mb-4'>Air Conditioners & Coolers</h1>
                <p>This is the Air Conditioners & Coolers category page.</p>
            </div>
            <Footer />
        </div>
    );
}

export default AirConditionersCoolers; 