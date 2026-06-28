export type Testimonial = {
  name: string;
  role: string;
  photo: string;
  quote: string;
  rating: number;
};

// Verbatim testimonials from cubiccode.in with real author photos.
export const testimonials: Testimonial[] = [
  {
    name: "Mr. Vishal",
    role: "Business Owner, Vishal Machine Tools",
    photo: "/images/testimonials/mr-vishal-business.jpg",
    rating: 5,
    quote:
      "I couldn't be happier with my choice of using Cubiccode to develop my new website. Their team was easy to work with and helped me make a terrific website in a short amount of time. Thanks again guys for all your hard work and keep up the great work!",
  },
  {
    name: "Dr. Varsha",
    role: "Dr. Sathe's Occlusion",
    photo: "/images/testimonials/dr-varsha.jpg",
    rating: 5,
    quote:
      "When it comes to creating professional, attractive, and effective websites, there is no company in and around Belgaum that can surpass Cubiccode. Thanks to their talent, our site has taken off in the search engines like a rocket. It is impossible to get ahead as a business without the support of gurus like Cubiccode standing behind you.",
  },
  {
    name: "Mr. Kumar",
    role: "Owner, FirstMark Ventures",
    photo: "/images/testimonials/firstmark.jpg",
    rating: 5,
    quote:
      "From our first contact with Cubiccode and Sarvesh, their communication has been excellent. They have been professional, courteous, and willing to work with us to get to our goals. Our working relationship has always been maintained with a positive attitude. I would highly recommend Cubiccode!",
  },
  {
    name: "Mrs. Sapna Jaini",
    role: "Global Migration Consultancy",
    photo: "/images/testimonials/mrs-sapna-jaini.jpg",
    rating: 5,
    quote:
      "If I have to say about Cubiccode's services in just three words: \"Worth Every Rupee\". What makes Cubiccode so special is the way they understand our business and the development requirements within a couple of meetings and delivered what they promised — which significantly improved our business.",
  },
  {
    name: "Elizabeth Pollard",
    role: "Swirl i-tech",
    photo: "/images/testimonials/elizabeth-pollard.jpg",
    rating: 5,
    quote:
      "We could not recommend choosing Cubiccode enough! The web app development industry is saturated with companies that are unprofessional, and we were very hesitant as to which would be best for our product. I would HIGHLY urge you to move forward with Cubiccode — for the quality of the product, the kindness of the people, and the attentiveness of the entire process.",
  },
];
