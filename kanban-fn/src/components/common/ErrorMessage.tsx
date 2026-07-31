interface Props{

message:string;

}


const ErrorMessage=({message}:Props)=>{


return (

<div className="
bg-red-100
text-red-600
p-4
rounded-lg">


{message}


</div>

)

}


export default ErrorMessage;