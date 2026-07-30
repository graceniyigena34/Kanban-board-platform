import { Request, Response } from "express";

import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from "../services/project.service";

import { AuthRequest } from "../middleware/auth.middleware";



export const create = async(
 req:AuthRequest,
 res:Response
)=>{

try{

 const project = await createProject(
   req.body.name,
   req.body.description,
   req.userId!
 );


 res.status(201).json(project);


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

 const projects = await getProjects(
   req.userId!
 );


 res.json(projects);


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
 const projectId = req.params.id;

 if(Array.isArray(projectId)){
   return res.status(400).json({
    message:"Invalid project id"
   });
 }

 const project = await getProjectById(
   projectId,
   req.userId!
 );


 if(!project){
   return res.status(404).json({
    message:"Project not found"
   });
 }


 res.json(project);


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
 const projectId = req.params.id;

 if(Array.isArray(projectId)){
   return res.status(400).json({
    message:"Invalid project id"
   });
 }

 const project = await updateProject(
   projectId,
   req.userId!,
   req.body
 );


 res.json(project);


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
 const projectId = req.params.id;

 if(Array.isArray(projectId)){
   return res.status(400).json({
    message:"Invalid project id"
   });
 }

 await deleteProject(
   projectId,
   req.userId!
 );


 res.json({
  message:"Project deleted"
 });


}catch(error:any){

 res.status(400).json({
  message:error.message
 });

}

};