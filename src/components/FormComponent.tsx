import * as React from "react"
import { ReactNode, CSSProperties } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FormProvider, useFormContext } from '../context/formContext'

interface StepProps {
  children: ReactNode
  title: string
}

interface StyleProps {
  className?: string
  style?: CSSProperties
}

interface MultiStepFormProps extends StyleProps {
  children: ReactNode
  onSubmit: (data: Record<string, any>) => void
  stepperProps?: StyleProps
  navigationProps?: StyleProps
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  children,
  onSubmit,
  className,
  style,
  stepperProps,
  navigationProps
}) => {
  const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[]
  const stepsData = steps.map((step, index) => ({
    step: index + 1,
    title: step.props.title
  }))

  return (
    <FormProvider>
      <MultiStepFormContent
        onSubmit={onSubmit}
        className={className}
        style={style}
        stepperProps={stepperProps}
        navigationProps={navigationProps}
        stepsData={stepsData}
      >
        {children}
      </MultiStepFormContent>
    </FormProvider>
  )
}

interface MultiStepFormContentProps extends MultiStepFormProps {
  stepsData: Array<{ step: number; title: string }>
}

const MultiStepFormContent: React.FC<MultiStepFormContentProps> = ({
  children,
  onSubmit,
  className,
  style,
  stepperProps,
  navigationProps,
  stepsData
}) => {
  const { currentStep, setCurrentStep, formData } = useFormContext()
  const steps = React.Children.toArray(children) as React.ReactElement<StepProps>[]

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <div className={`mx-auto p-2 sm:p-4 ${className || ''}`} style={style}>
      <div className="flex flex-col gap-4">
        <div className="w-full overflow-x-auto">
          <EnhancedStepper steps={stepsData} currentStep={currentStep + 1} {...stepperProps} />
        </div>
        <div className="w-full">
          <div className="rounded-lg p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep]}
              </motion.div>
            </AnimatePresence>
            <Navigation
              isFirstStep={currentStep === 0}
              isLastStep={currentStep === steps.length - 1}
              onNext={() => setCurrentStep((prev:any) => Math.min(prev + 1, steps.length - 1))}
              onPrev={() => setCurrentStep((prev:any) => Math.max(prev - 1, 0))}
              onSubmit={handleSubmit}
              {...navigationProps}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const Step: React.FC<StepProps & StyleProps> = ({ children, title, className, style }) => {
  return (
    <div className={`mt-4 ${className || ''}`} style={style}>
      {children}
    </div>
  )
}

interface StepperProps {
  steps: Array<{ step: number; title: string }>
  currentStep: number
  className?: string
  style?: React.CSSProperties
}

const EnhancedStepper: React.FC<StepperProps> = ({ steps, currentStep, className, style }) => {
  return (
    <div className={`flex mx-auto items-center justify-center font-sans w-max overflow-x-auto mb-2 ${className || ''}`} style={style}>
      {steps.map((s, index) => (
        <div key={s.step} className="flex items-center relative mr-4 sm:mr-8 last:mr-0">
          <motion.div
            className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 border-2 ${currentStep >= s.step ? 'border-none border-[#788191] bg-[#788191]' : 'border-[#EAECF0]'} p-1 sm:p-1.5 flex items-center justify-center rounded-full`}
            initial={false}
            animate={{
              scale: currentStep === s.step ? 1.1 : 1,
              transition: { duration: 0.3 }
            }}
          >
            {currentStep > s.step ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-full fill-[#F9F5FF]"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                  data-original="#000000"
                />
              </svg>
            ) : (
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${currentStep === s.step ? 'bg-[#EAECF0] drop-shadow-md' : 'bg-[#EAECF0]'} rounded-full`}></span>
            )}
          </motion.div>
          <div className="ml-2">
            <motion.h6
              className={`text-xs sm:text-sm font-normal ${currentStep === s.step ? 'text-[#3E3E45]' : 'text-[#71717A]'}`}
              initial={false}
              animate={{
                fontWeight: currentStep === s.step ? 'bold' : 'normal',
                transition: { duration: 0.3 }
              }}
            >
              {s.title}
            </motion.h6>
          </div>
          {index < steps.length - 1 && (
            <motion.div
              className={`absolute top-1/2 -right-3 sm:-right-6 w-2 sm:w-4 h-[2px]`}
              initial={false}
              animate={{
                backgroundColor: currentStep > s.step ? '#788191' : '#EAECF0',
                transition: { duration: 0.3 }
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

interface NavigationProps extends StyleProps {
  isFirstStep: boolean
  isLastStep: boolean
  onNext: () => void
  onPrev: () => void
  onSubmit: () => void
}

const Navigation: React.FC<NavigationProps> = ({
  isFirstStep,
  isLastStep,
  onNext,
  onPrev,
  onSubmit,
  className,
  style
}) => {
  return (
    <div className={`flex justify-between mt-8 ${className || ''}`} style={style}>
      <motion.button
        onClick={onPrev}
        disabled={isFirstStep}
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        Previous
      </motion.button>
      {isLastStep ? (
        <motion.button
          onClick={onSubmit}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Submit
        </motion.button>
      ) : (
        <motion.button
          onClick={onNext}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Next
        </motion.button>
      )}
    </div>
  )
}