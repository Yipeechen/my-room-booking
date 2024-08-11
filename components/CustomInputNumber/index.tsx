'use client';

import React, { useCallback, useRef, useEffect } from 'react';

interface ICustomInputNumberProps {
  min: number
  max: number
  step: number
  name: string
  value: number
  disabled: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

interface ICustomInputNumberButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled: boolean
  onMouseDown: () => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onTouchStart: () => void
  onTouchEnd: () => void
}

const AUTO_CLICK_INTERVAL = 500
const CustomInputNumberButton = (props: ICustomInputNumberButtonProps) => {
  const { children, onClick, disabled, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd } = props
  return (
    <button
      className='text-sky-400 text-xl flex justify-center items-center w-[48px] h-[48px] border-[1px] rounded-[8px] border-sky-400 disabled:opacity-50'
      onClick={onClick}
      disabled={disabled}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </button>
  )
}

const CustomInputNumber = (props: ICustomInputNumberProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const valueRef = useRef(0)
  const autoClickInterval = useRef<NodeJS.Timeout | null>(null)
  const { min, max, step, name, value, disabled, onChange, onBlur } = props

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const handleOnClick = useCallback((v: number) => {
    if (inputRef.current) {
      const newValue = String(v > 0 ? Math.min(max, +valueRef.current + v) : Math.max(min, +valueRef.current + v))

      if (+newValue !== valueRef.current) {
        valueRef.current = +newValue
        const event = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
      }) as any

      Object.defineProperty(event, 'target', { value: { value: newValue, name } })
      inputRef.current.dispatchEvent(event)
      onChange(event)
      }
    }
  }, [min, max, name, onChange])

  const startAutoClick = useCallback((v: number) => {
    if (autoClickInterval.current) return

    autoClickInterval.current = setInterval(() => {
      handleOnClick(v)
    }, AUTO_CLICK_INTERVAL)
  }, [handleOnClick])

  const stopAutoClick = useCallback(() => {
    if (autoClickInterval.current) {
      clearInterval(autoClickInterval.current)
      autoClickInterval.current = null
    }
  }, [])

  return (
    <div
      className={`flex flex-row items-center text-[16px] m-[8px]`}
      onBlur={onBlur}
    >
      <CustomInputNumberButton
        onClick={value <= min ? () => {} : () => handleOnClick(-step)}
        disabled={value <= min || disabled}
        onMouseDown={() => startAutoClick(-step)}
        onMouseUp={stopAutoClick}
        onMouseLeave={stopAutoClick}
        onTouchStart={() => startAutoClick(-step)}
        onTouchEnd={stopAutoClick}
      >
        -
      </CustomInputNumberButton>
      <div className={`text-xl flex justify-center items-center w-[48px] h-[48px] border-[1px] rounded-[8px] mx-[8px]`}>
        <input
          ref={inputRef}
          type='number'
          className='flex-shrink-0 text-gray-900 border-0 bg-transparent font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center text-[16px] size-full disabled:opacity-50'
          name={name}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          disabled={disabled}
        />
      </div>
      <CustomInputNumberButton
        onClick={value >= max ? () => {} : () => handleOnClick(step)}
        disabled={value >= max || disabled}
        onMouseDown={() => startAutoClick(step)}
        onMouseUp={stopAutoClick}
        onMouseLeave={stopAutoClick}
        onTouchStart={() => startAutoClick(step)}
        onTouchEnd={stopAutoClick}
      >
        +
      </CustomInputNumberButton>
    </div>
  )
}

export default CustomInputNumber