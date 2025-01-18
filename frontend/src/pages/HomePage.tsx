const HomePage = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <video
        src="/bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10 "
      ></video>
      <div className="relative z-10 flex items-center justify-center h-full text-white">
        <h2 className="text-8xl font-bold pb-4">ARE YOU READYYYYY CHAT?</h2>
      </div>{' '}
    </div>
  );
};

export default HomePage;
