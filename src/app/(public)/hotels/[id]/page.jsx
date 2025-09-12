import React from 'react';

const HotelDetails = async({params}) => {
    const {id} = await params
    return (
        <div>
            hotel details: {id}
        </div>
    );
};

export default HotelDetails;