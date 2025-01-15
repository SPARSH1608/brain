const HomePage = () => {
  return (
    <div>
      <div className="relative  flex  justify-center text-white">
        <h2 className="text-4xl font-bold pb-4">
          Explore our Complete Tailwind CSS Tutorial
        </h2>
      </div>
      <div className="relative h-screen w-screen  ">
        <video
          src="/assets/bg.mov"
          muted
          loop
          className="absolute z-10 inset-0 h-full 
        w-full object-cover"
        ></video>
      </div>
    </div>
  );
};

export default HomePage;
