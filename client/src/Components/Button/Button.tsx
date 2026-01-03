import React from "react";

interface ButtonProps {
    text: string;
    color: string;
    handleClick?: any;
    classes?: string;
}
const Button = ({ text, color, handleClick, classes }: ButtonProps) => {
    const colorVariants = {
        red: 'text-white bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none',
        purple: 'text-white bg-purple-500 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 focus:outline-none',
        green: 'text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:ring-green-300 focus:outline-none',
        blue: 'text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none',
      }
    return (
        <>
            <button
                type="button"
                className={`${colorVariants[color]} font-normal rounded-lg text-xs px-3 ${classes} py-1`}
                // className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-normal rounded-lg text-xs px-3 py-2 me-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800"
                onClick={handleClick}
            >
                {text}
            </button>
        </>
    );
};

export default Button;
