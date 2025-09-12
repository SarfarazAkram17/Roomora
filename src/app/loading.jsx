import Lottie from "lottie-react";

const Loading = () => {
  return (
    <div className="h-[60vh] flex justify-center items-center">
      <Lottie
        animationData='/loading.json'
        loop={true}
        className="h-[50vh]"
      />
    </div>
  );
};

export default Loading;