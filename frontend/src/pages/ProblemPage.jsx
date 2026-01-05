import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { PROBLEMS } from "../data/problems.js"
import Navbar from "../components/Navbar.jsx"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import CodeEditorPanel from "../components/CodeEditorPanel.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import ProblemDescription from "../components/ProblemDescription.jsx";
import { useNavigate } from "react-router";
import { executeCode } from "../lib/piston.js";
import toast from "react-hot-toast"
import confetti from "canvas-confetti"

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
    const newLang = e.target.value
    setSelectedLanguage(newLang)
    setCode(currentProblem.starterCode[newLang])
    setOutput(null)
  }

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`)

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output = "") => {
  return String(output)
    .trim()
    .split("\n")
    .map(line =>
      line
        .trim()
        .replace(/\[\s+/g, "[")
        .replace(/\s+\]/g, "]")
        .replace(/\s*,\s*/g, ",")
    )
    .filter(Boolean)
    .join("\n")
}


  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);
    // return true when normalized outputs match, otherwise false
    return normalizedActual === normalizedExpected;
  }

  const handleRunCode = async () => {
    setIsRunning(true)
    setOutput(null)
    const result = await executeCode(selectedLanguage, code)
    setOutput(result)
    setIsRunning(false)
    // * check if code executed successfully and matches expected output
    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage]
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput)

      if (testsPassed) {
        triggerConfetti()
        toast.success("All tests passed! Great job!")
      }
      else {
        toast.error("Tests failed. Check your output!")
      }

    } else {
      toast.error("Code execution failed!")
    }
  }

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal" storageKey="editor-layout">
          {/* Left panel:- Problem description */}
          <Panel defaultSize={40} minSize={20} collapsible>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle  disabled={isRunning} className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />
          {/* Right panel:- Code editor & output */}
          <Panel defaultSize={60} minSize={30} collapsible className="h-full">
            <PanelGroup direction="vertical" storageKey="right-layout"  className="h-full">
              {/* Top panel:- Code editor */}
              <Panel defaultSize={75} minSize={30} className="overflow-hidden">
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle disabled={isRunning} className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />


              {/* Down panel:- Output */}
              <Panel defaultSize={25} minSize={0} collapsible className="overflow-auto">
                <OutputPanel output={"Run the code to see output" || output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  )
}

export default ProblemPage