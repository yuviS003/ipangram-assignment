import { CircularProgress } from "@mui/material";

const CircularLoader = ({ loaderText = "Loading...." }) => {
  return (
    <div className="fixed z-[100] top-0 left-0 h-screen w-screen bg-green-950 bg-opacity-40 backdrop-blur-md text-white flex flex-col justify-center items-center gap-4 text-lg">
      <CircularProgress color="inherit" size={40} />
      <span>{loaderText}</span>
    </div>
  );
};

export default CircularLoader;
