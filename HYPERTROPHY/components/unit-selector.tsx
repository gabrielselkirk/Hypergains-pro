"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useUnits } from "@/lib/unit-context"
import { Settings } from "lucide-react"

interface UnitSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export default function UnitSelector({ isOpen, onClose }: UnitSelectorProps) {
  const { units, setWeightUnit, setHeightUnit } = useUnits()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Unit Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-semibold">Weight Unit</Label>
            <RadioGroup value={units.weightUnit} onValueChange={(value) => setWeightUnit(value as "kg" | "lbs")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kg" id="kg" />
                <Label htmlFor="kg">Kilograms (kg)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lbs" id="lbs" />
                <Label htmlFor="lbs">Pounds (lbs)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Height Unit</Label>
            <RadioGroup value={units.heightUnit} onValueChange={(value) => setHeightUnit(value as "cm" | "ft")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cm" id="cm" />
                <Label htmlFor="cm">Centimeters (cm)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ft" id="ft" />
                <Label htmlFor="ft">Feet & Inches (ft/in)</Label>
              </div>
            </RadioGroup>
          </div>

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
