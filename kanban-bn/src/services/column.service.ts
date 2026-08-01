import prisma from "../config/db";


export const createColumn = async(
  name:string,
  order:number,
  projectId:string,
  ownerId:string
)=>{

 const project = await prisma.project.findFirst({
   where:{
    id: projectId,
    ownerId
   }
 });

 if (!project) {
   throw new Error("Project not found");
 }

 return await prisma.column.create({
   data:{
     name,
     order,
     projectId
   }
 });

};



export const getColumns = async(
 projectId:string,
 ownerId:string
)=>{

 const project = await prisma.project.findFirst({
   where:{
    id: projectId,
    ownerId
   }
 });

 if (!project) {
   throw new Error("Project not found");
 }

 return await prisma.column.findMany({
   where:{
    projectId
   },
   orderBy:{
    order:"asc"
   },
   include:{
    tasks:true
   }
 });

};



export const updateColumn = async(
 id:string,
  ownerId:string,
 data:{
   name?:string;
   order?:number;
 }
)=>{

 const column = await prisma.column.findFirst({
   where:{
    id,
    project:{
      ownerId
    }
   }
 });

 if (!column) {
   throw new Error("Column not found");
 }

 return await prisma.column.update({
   where:{
    id
   },
   data
 });

};



export const deleteColumn = async(
 id:string,
 ownerId:string
)=>{

 const column = await prisma.column.findFirst({
   where:{
    id,
    project:{
      ownerId
    }
   }
 });

 if (!column) {
   throw new Error("Column not found");
 }

 return await prisma.column.delete({
   where:{
    id
   }
 });

};