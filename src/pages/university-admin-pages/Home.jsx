import { useState, useEffect } from "react";
import { ProjectItem } from "~/components";
import { mock_projects } from "~/const";
import images from "~/assets";
import axios from "~/api/axios";
import { useAuth } from "~/hooks";
import Pagination from "~/components/ProjectCardItem/Pagination";
const projectFilter = ["all_projects", "university_projects"];

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(projectFilter[0]);
  const { auth } = useAuth();
  console.log(auth);

  //Pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);

  useEffect(() => {
    if (selectedProject === "all_projects")
      axios
        .get(`/api/projects`)
        .then((res) => {
          console.log(res.data);
          setProjects(res.data);
        })
        .catch(() => {
          // Catch for test mock API
          setProjects(mock_projects);
        });
    else {
      axios
        .get(`/api/projects/university/${auth.id}`)
        .then((res) => {
          console.log(res.data);
          setProjects(res.data);
        })
        .catch(() => {
          // Catch for test mock API
          setProjects(mock_projects);
        });
    }
  }, [selectedProject]);

  // Get current posts
  const indexOfLastPost = currentPage * postPerPage
  const indexOfFirstPost = indexOfLastPost - postPerPage
  const currentPosts = projects.slice(indexOfFirstPost, indexOfLastPost)
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="wrapper px-20 py-10 border-4">
      <div className="flex justify-center">
        <img src={images.homebanner} alt="" className="w-full" />
      </div>
      <form className="max-w-md mx-auto">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative pt-10 ">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>

      </form>
      <div className="flex mb-4 pl-6 border-cyan-100">
        <input
          id="all_projects"
          type="radio"
          name="countries"
          // value="USA"
          className="w-6 h-6 border-gray-300 focus:ring-2 focus:ring-blue-300"
          onChange={() => {
            setSelectedProject(projectFilter[0]);
          }}
          checked
        // onClick={() => handleFilter(projectFilter[0])}
        />
        <label
          htmlFor="all_projects"
          className="pt-1 block ms-2 text-sm font-bold pr-10"
        >
          All projects
        </label>

        <input
          id="university_projects"
          type="radio"
          name="countries"
          // value="USA"
          className="w-6 h-6 border-gray-300 focus:ring-2 focus:ring-blue-300"
          onChange={() => {
            setSelectedProject(projectFilter[1]);
          }}
        // onClick={() => handleFilter(projectFilter[1])}
        />
        <label
          htmlFor="university_projects"
          className="pt-1 block ms-2  text-sm font-bold "
        >
          Your projects
        </label>
      </div>

      {/* load projects here */}
      <div className="relative overflow-x-auto sm:rounded-lg mt-5">
        <ProjectItem activities={currentPosts} />
        <Pagination postsPerPage={postPerPage} totalPosts={projects.length} paginate={paginate}/>
      </div>
    </div>
  );
};

export default Home;
