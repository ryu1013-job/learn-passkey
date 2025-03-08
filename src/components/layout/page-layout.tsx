import React from 'react'
import { cn } from '~/utils/classes'
import Footer from '../footer/footer'
import Header from '../header/header'

export default function PageLayout({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-dvh py-20 px-6 gap-16">
      <Header />
      <main className={cn('w-full', className)}>{children}</main>
      <Footer />
    </div>
  )
}
