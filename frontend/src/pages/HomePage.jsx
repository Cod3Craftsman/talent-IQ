import toast from "react-hot-toast"

function HomePage() {
  return (
    <div>
      <p>Home page</p>
      <button className="btn btn-secondary" onClick={() => toast.error("This is a success toast")}>Click me</button>
    </div>
  )
}

export default HomePage