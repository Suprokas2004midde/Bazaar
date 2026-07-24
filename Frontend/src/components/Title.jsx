import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className='inline-flex items-center gap-3 mb-4 group'>
      <h2 className='text-lg sm:text-2xl font-bold tracking-tight text-[var(--text-muted)] uppercase'>
        {text1} <span className='text-[var(--text-main)] font-extrabold text-[var(--primary-accent)]'>{text2}</span>
      </h2>
      <div className='w-10 sm:w-16 h-[2px] rounded-full bg-gradient-to-r from-[var(--primary-accent)] to-[var(--secondary-accent)]/50 transition-all duration-300 group-hover:w-24'></div>
    </div>
  );
};

export default Title;
