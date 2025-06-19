"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { WeightUnit, HeightUnit } from "./calculations"

interface UnitSettings {
  weightUnit: WeightUnit
  heightUnit: HeightUnit
}

interface UnitContextType {
  units: UnitSettings
  setWeightUnit: (unit: WeightUnit) => void
  setHeightUnit: (unit: HeightUnit) => void
}

const UnitContext = createContext<UnitContextType | undefined>(undefined)

export function UnitProvider({ children }: { children: ReactNode }) {
  const [units, setUnits] = useState<UnitSettings>({
    weightUnit: "kg",
    heightUnit: "cm",
  })

  const setWeightUnit = (unit: WeightUnit) => {
    setUnits((prev) => ({ ...prev, weightUnit: unit }))
  }

  const setHeightUnit = (unit: HeightUnit) => {
    setUnits((prev) => ({ ...prev, heightUnit: unit }))
  }

  return <UnitContext.Provider value={{ units, setWeightUnit, setHeightUnit }}>{children}</UnitContext.Provider>
}

export function useUnits() {
  const context = useContext(UnitContext)
  if (context === undefined) {
    throw new Error("useUnits must be used within a UnitProvider")
  }
  return context
}
