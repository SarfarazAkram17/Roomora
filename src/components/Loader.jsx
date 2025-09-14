'use client'
import Lottie from 'lottie-react';
import loader from '../../public/loader.json'

const Loader = () => {
    return (
    <div className="h-[60vh] flex justify-center items-center">
      <Lottie
        animationData={loader}
        loop={true}
        className="h-[50vh]"
      />
    </div>
    );
};

export default Loader;