import { useRef, useReducer, useCallback } from "react"

function getKeypointsObject(pose) {
  return pose.keypoints.reduce((acc, { part, position }) => {
    acc[part] = position
    return acc
  }, {})
}

function reducer(count, action) {
  if (action === "reset") return 0
  return count + 1
}

export default function(sensitivity = 10) {
  const [count, dispatch] = useReducer(reducer, 0)
  const standardRef = useRef(0)
  const checkPoses = useCallback(
    poses => {
      if (poses.length !== 1) return

      const {
        leftShoulder,
        rightShoulder,
        leftElbow,
        rightElbow,
        leftWrist,
        rightWrist
      } = getKeypointsObject(poses[0])

      const shoulder = leftShoulder || rightShoulder
      const elbow = leftElbow || rightElbow
      if (!shoulder || !elbow) return

      const down = shoulder.y > elbow.y
      if (down) {
        standardRef.current = Math.max(standardRef.current, elbow.y)
        return
      }

      const up = standardRef.current > elbow.y + sensitivity
      if (up) {
        dispatch("increment")
        standardRef.current = 0
        return
      }

      const wrist = leftWrist || rightWrist
      if (!wrist) return
      const rest = wrist.y > elbow.y
      if (rest) {
        dispatch("reset")
      }
    },
    [sensitivity]
  )
  return [count, checkPoses]
}
