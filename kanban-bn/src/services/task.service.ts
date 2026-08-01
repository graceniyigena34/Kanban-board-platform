import prisma from "../config/db";


export const createTask = async(
 title:string,
 description:string | undefined,
 priority:string,
 columnId:string,
 projectId:string,
  ownerId:string,
 assignedToId?:string
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

 const column = await prisma.column.findFirst({
   where:{
    id: columnId,
    projectId
   }
 });

 if (!column) {
   throw new Error("Column not found");
 }

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
 columnId:string,
 ownerId:string
)=>{

 const column = await prisma.column.findFirst({
   where:{
    id: columnId,
    project:{
      ownerId
    }
   }
 });

 if (!column) {
   throw new Error("Column not found");
 }

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
 id:string,
 ownerId:string
)=>{

 const task = await prisma.task.findFirst({
  where:{
    id,
    project:{
      ownerId
    }
  }
 });

 return task;

};



export const updateTask = async(
 id:string,
  ownerId:string,
 data:any
)=>{

 const task = await prisma.task.findFirst({
   where:{
    id,
    project:{
      ownerId
    }
   }
 });

 if (!task) {
   throw new Error("Task not found");
 }

 return await prisma.task.update({
  where:{
   id
  },
  data
 });

};



export const moveTask = async(
 id:string,
  columnId:string,
  ownerId:string
)=>{

 const task = await prisma.task.findFirst({
   where:{
    id,
    project:{
      ownerId
    }
   }
 });

 if (!task) {
   throw new Error("Task not found");
 }

 const column = await prisma.column.findFirst({
   where:{
    id: columnId,
    project:{
      ownerId
    }
   }
 });

 if (!column) {
   throw new Error("Column not found");
 }

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
 id:string,
 ownerId:string
)=>{

 const task = await prisma.task.findFirst({
   where:{
    id,
    project:{
      ownerId
    }
   }
 });

 if (!task) {
   throw new Error("Task not found");
 }

 return await prisma.task.delete({
  where:{
   id
  }
 });

};