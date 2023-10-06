"use client"

import React from "react"

interface InputProps {
    id: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    type: string
    value: string
}

const Input: React.FC<InputProps> = ({
    id,
    onChange,
    placeholder,
    type,
    value
}) => {

  return (
    <div className="relative">
        <input type={type} className="block rounded-md w-full px-4 pt-6 pb-1 bg-neutral-700
                appearance-none focus:outline-none focus:ring-0 peer"
                placeholder=""
                id={id} 
                value={value}
                onChange={onChange}/>
        <label htmlFor={id} className="absolute text-zinc-400 duration-150 
            transform -translate-y-3 scale-75 left-6 top-4 z-10 origin-[0]
            peer-placeholder-shown:scale-100
            peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3">
            {placeholder}
        </label>
    </div>
  )
}
export default Input