import React from 'react'
import Title from '../components/Title'
import NewsletterBox from '../components/NewsletterBox'

const Contacts = () => {
  return (
    <div>

      {/* ---------- Page Title ---------- */}
      <div className='text-2xl text-center pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      {/* ---------- Main Content ---------- */}
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>

        <img
          className='w-full md:max-w-[480px] object-cover'
          src='https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop'
          alt='Our store workspace'
        />

        <div className='flex flex-col justify-center items-start gap-6'>

          {/* Store Info */}
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>
            54709 Willms Station <br />
            Suite 350, Washington, USA
          </p>
          <p className='text-gray-500'>
            Tel: (415) 555-0132 <br />
            Email: admin@forever.com
          </p>

          {/* Careers */}
          <p className='font-semibold text-xl text-gray-600'>Careers at Forever</p>
          <p className='text-gray-500'>
            Learn more about our teams and job openings.
          </p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>
            Explore Jobs
          </button>

        </div>
      </div>

      {/* ---------- Newsletter ---------- */}
      <NewsletterBox />

    </div>
  )
}

export default Contacts
