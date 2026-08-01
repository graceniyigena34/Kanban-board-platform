import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/db";


export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedName || !normalizedEmail || !password) {
    throw new Error("Name, email and password are required");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  });


  if (existingUser) {
    throw new Error("User already exists");
  }


  const hashedPassword = await bcrypt.hash(password, 10);


  const user = await prisma.user.create({
    data:{
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword
    }
  });


  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};



export const loginUser = async (
  email:string,
  password:string
)=>{
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where:{
      email: normalizedEmail
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