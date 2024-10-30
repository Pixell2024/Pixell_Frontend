import React from 'react'
import { CircularProgress } from '@mui/material'

export default function CustomLoading() {
  return (
    <div>
       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
       <div className="bg-white h-[100px] w-[200px] flex justify-center items-center  rounded-md">

         <CircularProgress />
       </div>
     </div>
    </div>
  )
}
