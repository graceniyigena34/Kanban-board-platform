import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


interface Props{

children:React.ReactNode;

}



const DashboardLayout = ({children}:Props)=>{


return (

<div className="
flex
min-h-screen
bg-gray-100">


<Sidebar/>


<div className="
flex-1">


<Navbar/>


<main>

{children}

</main>


</div>



</div>

)

}


export default DashboardLayout;