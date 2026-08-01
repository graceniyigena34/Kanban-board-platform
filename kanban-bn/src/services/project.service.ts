import prisma from "../config/db";


export const createProject = async (
  name: string,
  description: string | undefined,
  ownerId: string
) => {

  const project = await prisma.project.create({
    data: {
      name,
      description,
      ownerId
    }
  });

  return project;
};



export const getProjects = async (
  ownerId: string
) => {

  return await prisma.project.findMany({
    where: {
      ownerId
    },
    include:{
      columns:true,
      tasks:true
    }
  });

};



export const getProjectById = async (
  id:string,
  ownerId:string
)=>{

  return await prisma.project.findFirst({
    where:{
      id,
      ownerId
    },
    include:{
      columns:true,
      tasks:true
    }
  });

};



export const updateProject = async (
  id:string,
  ownerId:string,
  data:{
    name?:string;
    description?:string;
  }
)=>{

  const project = await prisma.project.findFirst({
    where:{
      id,
      ownerId
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return await prisma.project.update({
    where:{
      id
    },
    data
  });

};



export const deleteProject = async (
  id:string,
  ownerId:string
)=>{

  const project = await prisma.project.findFirst({
    where:{
      id,
      ownerId
    }
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return await prisma.project.delete({
    where:{
      id
    }
  });

};