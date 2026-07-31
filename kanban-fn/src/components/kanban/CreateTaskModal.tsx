interface Props{

open:boolean;

close:()=>void;

}



const CreateTaskModal = ({open,close}:Props)=>{


if(!open) return null;


return (

<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center">


<div className="
bg-white
rounded-xl
p-6
w-full
max-w-md">


<h2 className="
text-xl
font-bold
mb-5">

Create Task

</h2>



<input
placeholder="Task title"
className="
w-full
border
p-3
rounded-lg
mb-3"
/>



<textarea
placeholder="Description"
className="
w-full
border
p-3
rounded-lg
mb-3"
/>



<button
className="
bg-purple-600
text-white
px-5
py-2
rounded-lg">

Save Task

</button>



<button
onClick={close}
className="
ml-3
text-gray-500">

Cancel

</button>


</div>


</div>

)

}


export default CreateTaskModal;