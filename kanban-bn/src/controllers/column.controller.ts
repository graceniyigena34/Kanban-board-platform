import { Response } from "express";

import {
 createColumn,
 getColumns,
 updateColumn,
 deleteColumn
} from "../services/column.service";

import { AuthRequest } from "../middleware/auth.middleware";



export const create = async(
 req:AuthRequest,
 res:Response
)=>{

try{

 const column = await createColumn(
   req.body.name,
   req.body.order,
   req.body.projectId
 );


 res.status(201).json(column);


}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};



export const getAll = async(
 req:AuthRequest,
 res:Response
)=>{

try{
 const projectId = req.params.projectId;

 if(Array.isArray(projectId)){
   return res.status(400).json({
    message:"Invalid project id"
   });
 }

 const columns = await getColumns(
   projectId
 );


 res.json(columns);


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
 const columnId = req.params.id;

 if(Array.isArray(columnId)){
   return res.status(400).json({
    message:"Invalid column id"
   });
 }

 const column = await updateColumn(
   columnId,
   req.body
 );


 res.json(column);


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
 const columnId = req.params.id;

 if(Array.isArray(columnId)){
   return res.status(400).json({
    message:"Invalid column id"
   });
 }

 await deleteColumn(
   columnId
 );


 res.json({
  message:"Column deleted"
 });


}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};