import prisma from "../config/db";


export const createTask = async(
 title:string,
 description:string | undefined,
 priority:string,
 columnId:string,
 projectId:string,
 assignedToId?:string
)=>{

 return await prisma.task.create({
  data:{
    title,
    description,
    priority: priority as any,
    columnId,
    projectId,
    assignedToId
  }
 });

};



export const getTasksByColumn = async(
 columnId:string
)=>{

 return await prisma.task.findMany({
  where:{
   columnId
  },
  orderBy:{
   createdAt:"asc"
  }
 });

};



export const getTaskById = async(
 id:string
)=>{

 return await prisma.task.findUnique({
  where:{
   id
  }
 });

};



export const updateTask = async(
 id:string,
 data:any
)=>{

 return await prisma.task.update({
  where:{
   id
  },
  data
 });

};



export const moveTask = async(
 id:string,
 columnId:string
)=>{

 return await prisma.task.update({
  where:{
   id
  },
  data:{
   columnId
  }
 });

};



export const deleteTask = async(
 id:string
)=>{

 return await prisma.task.delete({
  where:{
   id
  }
 });

};