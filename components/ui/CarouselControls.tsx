"use client";

import { useEffect, useRef, useState } from "react";

type CarouselControlsProps = {
  target: string;
  label: string;
  tone?: "light" | "dark";
  interval?: number;
};

export default function CarouselControls({
  target,
  label,
  tone = "light",
  interval = 5000,
}: CarouselControlsProps) {
  const [slideCount, setSlideCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const pauseUntilRef = useRef(0);

  useEffect(() => {
    const track = document.querySelector<HTMLElement>(target);
    if (!track) return;

    const getSlides = (): HTMLElement[] =>
      Array.from(track.children).filter(
        (element): element is HTMLElement => element instanceof HTMLElement
      );

    let slides = getSlides();
    setSlideCount(slides.length);

    if (slides.length < 2) return;

    let currentIndex = 0;
    let isVisible = false;
    let isHovered = false;
    let isPointerDown = false;
    let animationFrame = 0;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const pauseAutoplay = () => {
      pauseUntilRef.current = Date.now() + 8000;
    };

    const updateActiveIndex = () => {
      slides = getSlides();
      if (!slides.length) return;

      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + track.clientWidth / 2;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(center - trackCenter);

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      currentIndex = nearestIndex;
      setActiveIndex(nearestIndex);
    };

    const goTo = (requestedIndex: number) => {
      slides = getSlides();
      if (!slides.length) return;

      const nextIndex =
        ((requestedIndex % slides.length) + slides.length) % slides.length;
      const slide = slides[nextIndex];
      const trackRect = track.getBoundingClientRect();
      const slideRect = slide.getBoundingClientRect();
      const requestedLeft =
        track.scrollLeft + slideRect.left - trackRect.left;
      const maxLeft = Math.max(0, track.scrollWidth - track.clientWidth);
      const left = Math.min(maxLeft, Math.max(0, requestedLeft));

      currentIndex = nextIndex;
      setActiveIndex(nextIndex);
      track.scrollTo({
        left,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateActiveIndex);
    };

    const onPointerDown = () => {
      isPointerDown = true;
      pauseAutoplay();
    };

    const onPointerUp = () => {
      isPointerDown = false;
      pauseAutoplay();
    };

    const onMouseEnter = () => {
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = Boolean(entry?.isIntersecting);
    }, { threshold: 0.15 });

    observer.observe(track);

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    track.addEventListener("pointercancel", onPointerUp, { passive: true });
    track.addEventListener("mouseenter", onMouseEnter);
    track.addEventListener("mouseleave", onMouseLeave);

    const timer = window.setInterval(() => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;

      if (
        !isMobile ||
        !isVisible ||
        isHovered ||
        isPointerDown ||
        document.hidden ||
        reducedMotion.matches ||
        Date.now() < pauseUntilRef.current
      ) {
        return;
      }

      goTo(currentIndex + 1);
    }, interval);

    return () => {
      window.clearInterval(timer);
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      track.removeEventListener("pointercancel", onPointerUp);
      track.removeEventListener("mouseenter", onMouseEnter);
      track.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [target, interval]);

  if (slideCount < 2) return null;

  const navigateTo = (index: number) => {
    pauseUntilRef.current = Date.now() + 8000;
    const track = document.querySelector<HTMLElement>(target);
    if (!track) return;

    const slides = Array.from(track.children).filter(
      (element): element is HTMLElement => element instanceof HTMLElement
    );
    const slide = slides[index];
    if (!slide) return;

    const trackRect = track.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const requestedLeft = track.scrollLeft + slideRect.left - trackRect.left;
    const maxLeft = Math.max(0, track.scrollWidth - track.clientWidth);

    track.scrollTo({
      left: Math.min(maxLeft, Math.max(0, requestedLeft)),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <nav
      className={`carousel-pagination carousel-pagination--${tone}`}
      aria-label={`${label} carousel navigation`}
    >
      {Array.from({ length: slideCount }, (_, index) => (
        <button
          key={index}
          type="button"
          className={`carousel-pagination__dot ${
            activeIndex === index ? "is-active" : ""
          }`}
          aria-label={`Show ${label} item ${index + 1} of ${slideCount}`}
          aria-current={activeIndex === index ? "true" : undefined}
          onClick={() => navigateTo(index)}
        />
      ))}
    </nav>
  );
}