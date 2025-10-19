export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  subname: string;
  designation: string;
  src: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "murtaza-memon",
    name: "Murtaza",
    subname: "Memon",
    designation: "Managing Director Wasiq Industries",
    quote:
      "Working with Rehman was amazing! He’s great at web design and development, turning ideas into reality with skill and creativity. His clear communication and attention to detail made everything easy. Highly recommend him!",
    src: "testimonials/MurtazaMemon.avif",
  },
  {
    id: "jack-moss",
    name: "Jack",
    subname: "Moss",
    designation: "CEO Zonow Network",
    quote:
      "I have worked with Remi for couple of years. His designs are amazing and high detailed, with the fastest turnaround time I have seen. As for his websites, they are extremely well made and astonishingly fast. Zero corners are cut and he goes above and beyond to make my requests with 100% perfection.",
    src: "testimonials/JackMoss.avif",
  },
  {
    id: "zeshan-nawaz",
    name: "Zeshan",
    subname: "Nawaz",
    designation: "Managing Director Wasiq Industries",
    quote:
      "An absolutely outstanding experience from start to finish! The quality of service and attention to detail is unmatched. Every interaction felt personalized and genuine. This is what excellence looks like!",
    src: "testimonials/ZeeshanNawaz.avif",
  },
  {
    id: "chriss-pregler",
    name: "Chriss.",
    subname: "Pregler",
    designation: "CEO Mivator Development",
    quote:
      "Remi has always helped me out for over half a decade, creating stunning designs and memorable birthday giftcards. His creativity and attention to detail continually impress me, and he always delivers exceptional results quickly. Whenever I needed something special, Remi went above and beyond to make it perfect.",
    src: "testimonials/ChrissPregler.avif",
  },
  {
    id: "sarah-williams",
    name: "Sarah",
    subname: "Williams",
    designation: "Creative Director at DesignHub",
    quote:
      "Working with this team has been transformative for our business. Their innovative approach and dedication to delivering results is truly remarkable. I couldn't be happier with the outcome!",
    src: "testimonials/JackMoss.avif",
  },
];
