import WorksCards from "../components/WorksCards";

const Works = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground">
      {/* <Squircle width={250} height={350} roundness={0.2} color="#ff5722">
        <div className="flex items-center justify-center w-full h-full text-white font-bold">
          Hello
        </div>
      </Squircle> */}
      <WorksCards />
    </div>
  );
};

export default Works;
