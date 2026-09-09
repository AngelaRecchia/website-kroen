import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class ScrollWaveAnimator {
  constructor(wrapper, options = {}) {
    this.wrapper = wrapper;
    const dataset = wrapper?.dataset ?? {};

    this.config = {
      waveNumber: parseFloat(dataset.waveNumber ?? options.waveNumber ?? 3),
      waveSpeed: parseFloat(dataset.waveSpeed ?? options.waveSpeed ?? 1),
      direction: parseFloat(dataset.waveDirection ?? options.direction ?? 1),
      rangeMode: dataset.waveRange ?? options.rangeMode ?? "symmetric",
      itemSelector: options.itemSelector ?? ".wave-item",
      maxShift: parseFloat(dataset.waveMaxShift ?? options.maxShift ?? 72),
    };

    this.currentImage = null;
  }

  init() {
    if (!this.wrapper) return;

    this.items = gsap.utils.toArray(
      this.wrapper.querySelectorAll(this.config.itemSelector),
    );

    if (this.items.length === 0) return;

    this.quickSetters = this.items.map((item) =>
      gsap.quickTo(item, "x", { duration: 0.6, ease: "power4.out" }),
    );

    this.calculateRange();
    this.setInitialPositions();

    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.wrapper,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => this.handleScroll(self),
    });

    this.resizeHandler = () => this.calculateRange();
    window.addEventListener("resize", this.resizeHandler);
  }

  calculateRange() {
    const maxItemWidth = Math.max(...this.items.map((item) => item.offsetWidth));
    const available = Math.max(
      0,
      this.wrapper.offsetWidth - maxItemWidth,
    );
    const shift = Math.min(this.config.maxShift, available * 0.2);

    if (this.config.rangeMode === "align-start") {
      this.range = { minX: 0, maxX: shift * 2 };
    } else if (this.config.rangeMode === "align-end") {
      this.range = { minX: -shift * 2, maxX: 0 };
    } else {
      this.range = { minX: -shift, maxX: shift };
    }
  }

  setInitialPositions() {
    const rangeSize = this.range.maxX - this.range.minX;

    this.items.forEach((item, index) => {
      const initialPhase =
        this.config.waveNumber * index - Math.PI / 2;
      const initialWave = Math.sin(initialPhase);
      const initialProgress = (initialWave + 1) / 2;
      const startX =
        (this.range.minX + initialProgress * rangeSize) *
        this.config.direction;

      gsap.set(item, { x: startX });
    });
  }

  handleScroll(self) {
    const progress = self.progress;
    const focusedIndex = this.findClosestToViewportCenter();

    this.updateItems(progress, focusedIndex);
  }

  updateItems(progress, focusedIndex) {
    const rangeSize = this.range.maxX - this.range.minX;

    this.items.forEach((item, index) => {
      const finalX =
        this.calculateWavePosition(
          index,
          progress,
          this.range.minX,
          rangeSize,
        ) * this.config.direction;

      this.quickSetters[index](finalX);

      if (index === focusedIndex) {
        item.classList.add("wave-focused");
      } else {
        item.classList.remove("wave-focused");
      }
    });
  }

  calculateWavePosition(index, globalProgress, minX, range) {
    const phase =
      this.config.waveNumber * index +
      this.config.waveSpeed * globalProgress * Math.PI * 2 -
      Math.PI / 2;
    const wave = Math.sin(phase);
    const cycleProgress = (wave + 1) / 2;

    return minX + cycleProgress * range;
  }

  findClosestToViewportCenter() {
    const viewportCenter = window.innerHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    this.items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = Math.abs(elementCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  }

  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
    }
  }
}
