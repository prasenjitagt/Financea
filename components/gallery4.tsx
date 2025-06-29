"use client";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items?: Gallery4Item[];
}

const data = [
  {
    id: "shadcn-ui",
    title: "shadcn/ui: Building a Modern Component Library",
    description:
      "Explore how shadcn/ui revolutionized React component libraries by providing a unique approach to component distribution and customization.",

    image:
      "https://images.unsplash.com/photo-1551250928-243dc937c49d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "tailwind",
    title: "Tailwind CSS: The Utility-First Revolution",
    description:
      "Discover how Tailwind CSS transformed styling with a utility-first approach that speeds up development while maintaining design flexibility.",

    image:
      "https://images.unsplash.com/photo-1551250928-e4a05afaed1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "astro",
    title: "Astro: The All-in-One Web Framework",
    description:
      "Learn how Astro's 'Islands Architecture' helps build faster websites with rich interactivity where needed.",
    image:
      "https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "react",
    title: "React: Pioneering Component-Based UI",
    description:
      "See how React's component-based architecture enables reusable, maintainable code for complex UIs.",
    image:
      "https://images.unsplash.com/photo-1548324215-9133768e4094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.0.3&q=80&w=1080",
  },
];

const Gallery4 = ({
  title = "Built for amazing peoples like you",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences.",
  items = data,
}: Gallery4Props) => {
  return (
    <section className="py-32 mx-auto max-w-7xl px-4">
      <div className="mb-16">
        <h2 className="text-3xl font-medium  lg:text-5xl max-w-lg">{title}</h2>
        <p className=" mt-4 text-muted-foreground max-w-120">{description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.slice(0, 4).map((item) => (
          <a
            key={item.id}
            href={item.href}
            className="group relative rounded-xl overflow-hidden shadow-md transition-transform hover:scale-[1.02]"
          >
            <div className="relative aspect-[9/10] w-full">
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Black gradient at bottom only */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              {/* Text content over image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-lg font-medium leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export { Gallery4 };
