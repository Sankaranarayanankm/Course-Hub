const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden">
      {/* Background blur circles */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner */}
        <div className="relative h-28 w-28 flex items-center justify-center">
          <div className="absolute h-28 w-28 rounded-full border-[6px] border-white/10" />
          <div className="absolute h-28 w-28 rounded-full border-[6px] border-transparent border-t-indigo-400 animate-spin" />
          <div className="absolute h-20 w-20 rounded-full border-[5px] border-transparent border-r-cyan-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="h-4 w-4 rounded-full bg-white animate-ping" />
        </div>

        <h1 className="mt-8 text-3xl font-bold text-white tracking-wide">
          CourseHub
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Preparing your learning experience...
        </p>

        <div className="mt-6 flex gap-2">
          <span className="h-3 w-3 rounded-full bg-indigo-400 animate-bounce" />
          <span className="h-3 w-3 rounded-full bg-cyan-400 animate-bounce delay-150" />
          <span className="h-3 w-3 rounded-full bg-violet-400 animate-bounce delay-300" />
        </div>

        <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
