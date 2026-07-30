import prisma from "../config/db";


export const createColumn = async(
  name:string,
  order:number,
  projectId:string
)=>{

 return await prisma.column.create({
   data:{
     name,
     order,
     projectId
   }
 });

};



export const getColumns = async(
 projectId:string
)=>{

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
 data:{
   name?:string;
   order?:number;
 }
)=>{

 return await prisma.column.update({
   where:{
    id
   },
   data
 });

};



export const deleteColumn = async(
 id:string
)=>{

 return await prisma.column.delete({
   where:{
    id
   }
 });

};