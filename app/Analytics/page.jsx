import Map from "./Components/MyMap/Map";
import Hostory from "./Components/MyMap/Hostory";
import Accidents from "./Components/MyMap/Accidents";

export default function Page() {

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Traffic Monitor</h1>
          <p className="text-muted-foreground">
            Real-time traffic analysis and monitoring dashboard
          </p>
        </div>
        <div className="flex items-center gap-4">
          
        </div>
      </div>

      {/* Add Map Section */}
      <Map/>
      <Hostory/>
      <Accidents/>

 



    </div>




  );
}
