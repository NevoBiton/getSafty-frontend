function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 z-40">
      {/* Rocket GIF */}
      <img
        src="https://media.tenor.com/QhRvvwpCdVoAAAAj/rocket.gif"
        alt="Loading..."
        className="w-36 z-40 h-auto mb-4"
      />

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden z-40">
        <div className="h-full bg-blue-500 animate-progress z-40"></div>
      </div>
    </div>
  );
}

export default Loader;
