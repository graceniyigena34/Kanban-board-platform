import { Link } from "react-router-dom";


const Landing = () => {

  return (
    <div className="min-h-screen bg-white">


      {/* Navbar */}
      <nav className="
      flex 
      justify-between 
      items-center
      px-10
      py-6
      border-b">

        <h1 className="
        text-2xl
        font-bold
        text-purple-600">

          KanbanBoard

        </h1>


        <div className="flex gap-4">


          <Link
          to="/login"
          className="
          px-5
          py-2
          text-gray-700">

            Login

          </Link>



          <Link
          to="/register"
          className="
          bg-purple-600
          text-white
          px-5
          py-2
          rounded-lg">

            Register

          </Link>


        </div>


      </nav>



      {/* Hero Section */}

      <section className="
      flex
      flex-col
      items-center
      text-center
      px-6
      py-32">


        <h2 className="
        text-5xl
        font-bold
        text-gray-900
        max-w-3xl">

          Manage Projects
          <br/>
          Collaborate With Your Team

        </h2>



        <p className="
        mt-6
        text-gray-500
        max-w-xl">

          A complete project management platform
          where teams can create projects,
          organize tasks and track progress
          using Kanban boards.

        </p>



        <Link
        to="/register"
        className="
        mt-8
        bg-purple-600
        text-white
        px-8
        py-3
        rounded-xl">

          Start Managing

        </Link>


      </section>



    </div>
  )
}


export default Landing;