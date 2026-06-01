// Carrossel genérico – exporta classe ou funções
export class Carousel {
  constructor(trackSelector, options = {}) {
    this.track = document.querySelector(trackSelector);
    if (!this.track) throw new Error('Track not found');
    this.slides = [...this.track.children];
    this.current = 0;
    this.auto = options.auto || false;
    this.interval = options.interval || 5000;
    this.gap = options.gap || 20;
    this.slidesPerView = options.slidesPerView || 1;
    this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
    this.onChange = options.onChange || (() => {});
    this.init();
  }

  init() {
    this.updateDimensions();
    this.goTo(0);
    if (this.auto) this.startAuto();
    window.addEventListener('resize', () => this.updateDimensions());
  }

  updateDimensions() {
    const wrapper = this.track.parentElement;
    const wrapperRect = wrapper.getBoundingClientRect();
    const slideWidth = (wrapperRect.width - (this.gap * (this.slidesPerView - 1))) / this.slidesPerView;
    this.slides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });
    this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
    if (this.current > this.maxIndex) this.current = this.maxIndex;
    this.applyTransform();
  }

  applyTransform() {
    const slideWidth = this.slides[0]?.offsetWidth || 0;
    this.track.style.transform = `translateX(${-(this.current * (slideWidth + this.gap))}px)`;
    this.onChange(this.current);
  }

  goTo(index) {
    this.current = Math.max(0, Math.min(index, this.maxIndex));
    this.applyTransform();
    if (this.auto) this.restartAuto();
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  startAuto() {
    if (this.autoTimer) clearInterval(this.autoTimer);
    if (this.slides.length <= this.slidesPerView) return;
    this.autoTimer = setInterval(() => this.next(), this.interval);
  }
  restartAuto() { if (this.auto) { this.startAuto(); } }
}