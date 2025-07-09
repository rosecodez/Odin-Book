import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function animateOnScroll(selector = ".animate-on-scroll") {
  const elements = gsap.utils.toArray(selector);

  elements.forEach((el) => {
    gsap.fromTo(
      el,
      {
        opacity: 0,
        y: 60,
        visibility: "hidden",
      },
      {
        opacity: 1,
        y: 0,
        visibility: "visible",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "restart none none reset",
        },
      }
    );
  });

  ScrollTrigger.refresh();
}
