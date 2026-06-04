import React from 'react'
import Navbar from '../components/Navbar'
import HeroPage from './HeroPage'

const Home = () => {
  const features = [
    {
      title: 'Private family circles',
      description:
        'Create invite-only spaces so stories and photos stay with the people who matter most.',
    },
    {
      title: 'Timeline memories',
      description:
        'Pin milestones to a shared timeline and watch your family history unfold year by year.',
    },
    {
      title: 'Story-rich posts',
      description:
        'Capture the context behind each photo with notes, dates, and the voices that were there.',
    },
    {
      title: 'Easy invites',
      description:
        'Bring relatives in with a simple invite flow so everyone can contribute right away.',
    },
    {
      title: 'Moderated approvals',
      description:
        'Keep your archive trusted with admin approvals for new members and submissions.',
    },
    {
      title: 'Searchable archives',
      description:
        'Find memories fast with organized collections and clean, card-based browsing.',
    },
  ]

  return (
    <div>
      <Navbar/>
      <HeroPage />
      <section className="bg-amber-50/60 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-stone-900 md:text-4xl">
              Built for every chapter of your family
            </h2>
            <p className="mt-3 text-base text-stone-600">
              Virasat keeps memories organized, shared, and protected so your story is easy to
              preserve across generations.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#A65E2E]/10 text-sm font-semibold text-[#A65E2E]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-semibold text-stone-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
