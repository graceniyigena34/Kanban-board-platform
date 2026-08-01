import { Response } from "express";

import {
 createTask,
 getTasksByColumn,
 getTaskById,
 updateTask,
 moveTask,
 deleteTask
} from "../services/task.service";

import { AuthRequest } from "../middleware/auth.middleware";



export const create = async(
req:AuthRequest,
res:Response
)=>{

try{

 const task = await createTask(
  req.body.title,
  req.body.description,
  req.body.priority,
  req.body.columnId,
  req.body.projectId,
    req.userId!,
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
req:AuthRequest,
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
    columnId,
    req.userId!
 );


 res.json(tasks);


}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};




export const getOne = async(
req:AuthRequest,
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
    taskId,
    req.userId!
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
req:AuthRequest,
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
    req.userId!,
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
req:AuthRequest,
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
    req.body.columnId,
    req.userId!
 );


 res.json(task);

}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};





export const remove = async(
req:AuthRequest,
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
    taskId,
    req.userId!
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