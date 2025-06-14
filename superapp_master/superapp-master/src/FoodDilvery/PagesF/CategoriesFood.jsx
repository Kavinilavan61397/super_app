import React from 'react';
import HeaderInsideFood from '../ComponentsF/HeaderInsideFood';
import FooterFood from '../ComponentsF/FooterFood';

function CategoriesFood() {
    return (
        <div>
            <HeaderInsideFood />
            <div className='pt-20 px-4'>
                <h1>CategoriesFood</h1>
            </div>

            <FooterFood />
        </div>
    );
}
export default CategoriesFood;