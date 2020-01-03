import "regenerator-runtime/runtime"
import React, { useCallback } from "react"
import PoseNet from "react-posenet"
import usePullUpCounter from "./usePullUpCounter"

const inferenceConfig = {
  decodingMethod: "single-person"
}

function App() {
  const [count, checkPoses] = usePullUpCounter()
  const onEstimate = useCallback(poses => checkPoses(poses), [checkPoses])

  return (
    <>
      <h1>{`Pull up count: ${count}`}</h1>
      <PoseNet
        className="min-vh-100"
        facingMode="environment"
        inferenceConfig={inferenceConfig}
        onEstimate={onEstimate}
      />
    </>
  )
}

export default App
