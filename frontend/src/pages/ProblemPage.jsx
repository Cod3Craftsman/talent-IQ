import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { PROBLEMS } from "../data/problems.js"
import Navbar from "../components/Navbar.jsx"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import CodeEditor from "../components/CodeEditor.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import ProblemDescription from "../components/ProblemDescription.jsx";
import { useNavigate } from "react-router";

function ProblemPage() {
  const { id } = useParams();
  const [currentProblemId, setCurrentProblemId] = useState("two-sum")
  const [selectedLanguage, setSelectedLanguage] = useState("javascript")
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript)
  const [output, setOutput] = useState(null)
  const [isRunning, setIsRunning] = useState(false)

  const currentProblem = PROBLEMS[currentProblemId]
  const navigate = useNavigate()



  // *update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id)
      setCode(PROBLEMS[id].starterCode[selectedLanguage])
      setOutput(null)
    }
  }, [id, selectedLanguage])




  const handleLanguageChange = (e) => {

  }

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`)

  const triggerConfetti = () => { }

  const checkIfTestsPassed = () => { }

  const hadnleRunCode = () => {

  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* Left panel:- Problem description */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />
          {/* Right panel:- Code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel:- Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditor />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />


              {/* Down panel:- Output */}
              <Panel defaultSize={30} minSize={30}>
                <OutputPanel />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

export default ProblemPage