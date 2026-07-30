import {Request, Response} from "express";

import {
 createTask,
 getTasksByColumn,
 getTaskById,
 updateTask,
 moveTask,
 deleteTask
} from "../services/task.service";



export const create = async(
req:Request,
res:Response
)=>{

try{

 const task = await createTask(
  req.body.title,
  req.body.description,
  req.body.priority,
  req.body.columnId,
  req.body.projectId,
  req.body.assignedToId
 );


 res.status(201).json(task);


}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};




export const getByColumn = async(
req:Request,
res:Response
)=>{

try{
 const columnId = req.params.id;

 if(Array.isArray(columnId)){
  return res.status(400).json({
   message:"Invalid column id"
  });
 }

 const tasks = await getTasksByColumn(
  columnId
 );


 res.json(tasks);


}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};




export const getOne = async(
req:Request,
res:Response
)=>{

try{
 const taskId = req.params.id;

 if(Array.isArray(taskId)){
  return res.status(400).json({
   message:"Invalid task id"
  });
 }

 const task = await getTaskById(
  taskId
 );


 if(!task){
  return res.status(404).json({
   message:"Task not found"
  });
 }


 res.json(task);

}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};





export const update = async(
req:Request,
res:Response
)=>{

try{
 const taskId = req.params.id;

 if(Array.isArray(taskId)){
  return res.status(400).json({
   message:"Invalid task id"
  });
 }

 const task = await updateTask(
  taskId,
  req.body
 );


 res.json(task);

}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};





export const move = async(
req:Request,
res:Response
)=>{

try{
 const taskId = req.params.id;

 if(Array.isArray(taskId)){
  return res.status(400).json({
   message:"Invalid task id"
  });
 }

 const task = await moveTask(
  taskId,
  req.body.columnId
 );


 res.json(task);

}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};





export const remove = async(
req:Request,
res:Response
)=>{

try{
 const taskId = req.params.id;

 if(Array.isArray(taskId)){
  return res.status(400).json({
   message:"Invalid task id"
  });
 }

 await deleteTask(
  taskId
 );


 res.json({
  message:"Task deleted"
 });

}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};