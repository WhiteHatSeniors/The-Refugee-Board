import React from 'react'

function Contact() {
    return (
        <div>
            <h1 className='font-bold text-5xl p-10 underline mt-7'>Contact Us</h1>
            <h2 className='font-semibold text-2xl p-10'>Have queries regarding the project?</h2>
            <div className='text-center'>
                <p>Contact the devs.</p>
                <div className='flex-col'>
                    <div>
                        <a className='underline italic text-red-800' href="mailto:afnanind@gmail.com">Sayed Afnan Khazi</a>
                    </div>
                    <div>
                        <a className='underline italic text-red-800' href="mailto:hisham0502@gmail.com">Syed Hisham Akmal</a>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Contact