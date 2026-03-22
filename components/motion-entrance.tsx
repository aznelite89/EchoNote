"use client"

import {
  motion,
  useAnimationControls,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from "framer-motion"
import { useEffect, useState, type ReactNode } from "react"

export type MotionEntranceProps = Omit<
  HTMLMotionProps<"div">,
  "initial" | "animate"
> & {
  children: ReactNode
  staticTarget: TargetAndTransition
  entranceFrom: TargetAndTransition
  entranceTransition?: Transition
}

export function MotionEntrance({
  children,
  staticTarget,
  entranceFrom,
  entranceTransition,
  ...rest
}: MotionEntranceProps) {
  const controls = useAnimationControls()
  const [linked, setLinked] = useState(false)

  useEffect(() => {
    setLinked(true)
    controls.set(entranceFrom)
    void controls.start({ ...staticTarget, transition: entranceTransition })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls])

  return (
    <motion.div
      {...rest}
      initial={false}
      animate={linked ? controls : staticTarget}
    >
      {children}
    </motion.div>
  )
}
