import React from 'react'
import { languages , frameworks, tech } from '@/data'
import { InfiniteMovingCards } from './ui/InfiniteCards'

const Technologies = () => {
  return (
    <div id='technologies' className="py-20">
      <h1 className="heading pb-10">
        my {" "}
        <span className="text-purple">technologies</span>
      </h1>
      <h1 className="heading">↓</h1>
      <h2 className="subheading text-24 pt-5 pb-10">
        programming <span className="text-purple">languages</span>
      </h2>
      <InfiniteMovingCards
        items={languages}
        direction="right"
        speed="fast"
        />
      <h2 className="subheading text-24 pt-5 pb-10">
        frameworks & <span className="text-purple">libraries</span>
      </h2>
      <InfiniteMovingCards
        items={frameworks}
        direction="left"
        speed="fast"
        />
      <h2 className="subheading text-24 pt-5 pb-10">
        tools & <span className="text-purple">technologies</span>
      </h2>
      <InfiniteMovingCards
        items={tech}
        direction="right"
        speed="fast"
        />
    </div>
  );
}

export default Technologies
