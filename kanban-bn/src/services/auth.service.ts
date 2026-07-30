import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db";


export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {

  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  });


  if (existingUser) {
    throw new Error("User already exists");
  }


  const hashedPassword = await bcrypt.hash(password, 10);


  const user = await prisma.user.create({
    data:{
      name,
      email,
      password: hashedPassword
    }
  });


  return user;
};



export const loginUser = async (
  email:string,
  password:string
)=>{

  const user = await prisma.user.findUnique({
    where:{
      email
    }
  });


  if(!user){
    throw new Error("Invalid email or password");
  }


  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );


  if(!passwordMatch){
    throw new Error("Invalid email or password");
  }


  const token = jwt.sign(
    {
      userId:user.id
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn:"1d"
    }
  );


  return {
    user:{
      id:user.id,
      name:user.name,
      email:user.email
    },
    token
  };

};