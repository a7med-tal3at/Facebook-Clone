'use client';

import Image from 'next/image';

const Sponsored = () => {
  return (
    <div className="flex-col hidden gap-2 py-4 pr-4 mx-auto lg:flex">
      <div className="text-black whitespace-normal dark:text-neutral-400">
        Be sure to check out my other projects
      </div>

      <a
        href="#"
        target="_blank"
        className="sponsored-grid gap-4 pr-2 duration-300 rounded-md
        hover:bg-neutral-200 dark:hover:bg-[#3a3b3c]"
      >
        <div className="overflow-hidden rounded-md">
          <Image
            alt="portfolio"
            src="https://placehold.co/90x90"
            width={90}
            height={90}
            className="object-contain duration-300 aspect-square hover:scale-110"
          />
        </div>
        <div className="my-auto">
          <div className="text-black dark:text-neutral-400">My Portfolio</div>
          <div className="text-sm font-light text-neutral-500 dark:text-neutral-400">Test</div>
        </div>
      </a>
    </div>
  );
};

export default Sponsored;
