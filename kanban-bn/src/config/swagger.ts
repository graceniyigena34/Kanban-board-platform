import swaggerJsdoc from "swagger-jsdoc";



const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "TaskFlow API",
      version: "1.0.0",
      description:
        "Project Management Platform API with Kanban boards"
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },

  },

  apis: [
    "./src/routes/*.ts"
  ]

};


const swaggerSpec = swaggerJsdoc(options);


export default swaggerSpec;