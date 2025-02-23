"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ImageViewerProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1)

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3))
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5))
  const handleReset = () => setScale(1)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          {/* Content wrapper - stop propagation to prevent closing when clicking image */}
          <motion.div
            className="relative flex max-h-[90vh] max-w-[90vw] flex-col overflow-hidden rounded-lg bg-background"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Image container */}
            <div className="relative flex h-full max-h-[80vh] w-full items-center justify-center overflow-hidden p-4">
              <motion.div
                animate={{ scale }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                style={{ cursor: "grab" }}
                drag
                dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                dragElastic={0.1}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={alt}
                  width={800}
                  height={600}
                  className="h-auto max-h-[70vh] w-auto rounded-lg object-contain"
                  priority
                />
              </motion.div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-2 border-t bg-background/80 p-4 backdrop-blur">
              <TooltipProvider>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={scale >= 3}>
                        <ZoomIn className="h-4 w-4" />
                        <span className="sr-only">Zoom in</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Zoom In</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={scale <= 0.5}>
                        <ZoomOut className="h-4 w-4" />
                        <span className="sr-only">Zoom out</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Zoom Out</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4" />
                        <span className="sr-only">Reset zoom</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset Zoom</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => window.open(src, "_blank")}>
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download image</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Download Image</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 