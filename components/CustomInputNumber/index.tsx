'use client';

import React, { useCallback, useRef } from 'react';
import { ChangeHandler } from 'react-hook-form'

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

const CustomInputNumber = (props: ICustomInputNumberProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { min, max, step, name, value, disabled, onChange, onBlur } = props

  const handleOnClick = useCallback((v: number) => {
    if (inputRef.current) {
      const newValue = String(+value + v)
      const event = new InputEvent('input', {
        bubbles: true,
        cancelable: true,
      }) as any

      Object.defineProperty(event, 'target', { value: { value: newValue, name } })
      inputRef.current.dispatchEvent(event)
      onChange(event)
    }
  }, [value, onChange, name])

  return (
    <div
      className={`flex flex-row items-center text-[16px] m-[8px]`}
      onBlur={onBlur}
    >
      <button
        className='text-sky-400 text-xl flex justify-center items-center w-[48px] h-[48px] border-[1px] rounded-[8px] border-sky-400 disabled:opacity-50'
        onClick={value <= min ? () => {} : () => handleOnClick(-step)}
        disabled={value <= min || disabled}
        // TODO: 長按按鈕，連續增加
      >
        -
      </button>
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
      <button
        className='text-sky-400 text-xl flex justify-center items-center w-[48px] h-[48px] border-[1px] rounded-[8px] border-sky-400 disabled:opacity-50'
        onClick={value >= max ? () => {} : () => handleOnClick(step)}
        disabled={value >= max || disabled}
      >
        +
      </button>
    </div>
  )
}

export default CustomInputNumber