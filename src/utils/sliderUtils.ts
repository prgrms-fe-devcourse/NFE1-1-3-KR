import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';

const wrapProgress = gsap.utils.wrap(0, 1);

const snap = (length: number) => {
  return gsap.utils.snap(1 / length);
};

// TODO: 기능 구현 완료 후 삭제 예정
const setActiveImage = (images: HTMLDivElement[], index: number) => {
  document.querySelector('.wheel__card.active')?.classList.remove('active');
  images[index].classList.add('active');
};

const rotateSlider = (
  target: HTMLDivElement,
  rotation: number,
  duration: number,
  ease: string,
  onComplete?: () => void,
) => {
  gsap.to(target, {
    rotation,
    duration,
    ease,
    onComplete,
  });
};

const moveWheel = (
  images: HTMLDivElement[],
  amount: number,
  tl: gsap.core.Timeline,
  tracker: { item: number },
) => {
  const total = images.length;

  const progress = tl.progress();
  tl.progress(wrapProgress(snap(total)(tl.progress() + amount)));
  const next = tracker.item;
  tl.progress(progress);

  setActiveImage(images, next);

  console.log('실행 전: ', tl.progress());

  gsap.to(tl, {
    progress: snap(total)(tl.progress() + amount),
    modifiers: {
      progress: wrapProgress,
    },
  });
  console.log('실행 후: ', tl.progress());
};

export const setupWheel = (wheel: HTMLDivElement, images: HTMLDivElement[]) => {
  const radius = wheel.offsetWidth / 2;
  const center = wheel.offsetWidth / 2;
  const slice = (2 * Math.PI) / images.length;

  images.forEach((item, i) => {
    const angle = i * slice;
    const x = center + radius * Math.sin(angle);
    const y = center - radius * Math.cos(angle);

    gsap.set(item, {
      rotation: angle + '_rad',
      xPercent: -50,
      yPercent: -50,
      x: x,
      y: y,
    });
  });

  images[0].classList.add('active');
};

export const setupTimeline = (total: number, tl: gsap.core.Timeline, tracker: { item: number }) => {
  const wrapTracker = gsap.utils.wrap(0, total);

  tl.to(
    '.wheel',
    {
      rotation: '+=360',
      transformOrigin: 'center',
      duration: 1,
      ease: 'none',
    },
    0,
  );

  tl.to(
    tracker,
    {
      item: total,
      duration: 1,
      ease: 'none',
      modifiers: {
        item(value: number) {
          return wrapTracker(total - Math.round(value));
        },
      },
    },
    0,
  );

  gsap.to(tl, {
    duration: 2,
    progress: snap(total)(tl.progress() - 1),
    modifiers: {
      progress: wrapProgress,
    },
  });
};

export const handleDrag = (
  images: HTMLDivElement[],
  tl: gsap.core.Timeline,
  tracker: { item: number },
) => {
  const total = images.length;
  const AnglePerImage = 360 / total;
  let startRotation = 0;

  Draggable.create('.wheel', {
    type: 'rotation',
    onPress: function () {
      startRotation = this.rotation as number;
    },
    onDrag: function () {
      rotateSlider(this.target as HTMLDivElement, this.rotation as number, 0.1, 'power2.out');
    },
    onDragEnd: function () {
      const rotationDiff = this.rotation - startRotation;
      const distance = Math.round(rotationDiff / AnglePerImage);

      console.log('실행 전: ', tl.progress());

      gsap.to(tl, {
        progress: snap(total)(tl.progress() + distance / total),
        modifiers: {
          progress: wrapProgress,
        },
      });

      console.log('실행 후: ', tl.progress());

      const next = (tracker.item - distance + total) % total;
      setActiveImage(images, next);

      const finalRotation = startRotation + distance * AnglePerImage;
      rotateSlider(this.target as HTMLDivElement, finalRotation, 1, 'power4.out');
    },
  });
};

export const handleClick = (
  images: HTMLDivElement[],
  tl: gsap.core.Timeline,
  tracker: { item: number },
  modal: HTMLDivElement,
) => {
  const total = images.length;
  const step = 1 / total;

  images.forEach((el, i) => {
    el.addEventListener('click', function () {
      const currentActive = tracker.item;

      if (i === currentActive) {
        handleActiveClick(el as AnimatedHTMLDivElement, modal);
      }

      setActiveImage(images, i);

      const diff = currentActive - i;

      if (Math.abs(diff) < total / 2) {
        moveWheel(images, diff * step, tl, tracker);
      } else {
        const amt = total - Math.abs(diff);
        if (currentActive > i) {
          moveWheel(images, amt * -step, tl, tracker);
        } else {
          moveWheel(images, amt * step, tl, tracker);
        }
      }
    });
  });
};

interface AnimatedHTMLDivElement extends HTMLDivElement {
  animation?: gsap.core.Timeline;
}

const handleActiveClick = (card: AnimatedHTMLDivElement, modal: HTMLDivElement) => {
  const faces = card.querySelector('.faces');

  const animation = gsap.timeline({ paused: true });
  animation.to(faces, { rotationY: 180 });
  animation.set(card, { opacity: 0 });
  animation.add(function () {
    card.dataset.flipId = 'wheel__card';
    const state = Flip.getState([card, modal], {
      props: 'borderRadius, aspectRatio, boxShadow',
    });

    modal.classList.add('active');

    Flip.from(state, {
      duration: 0.25,
      ease: 'sine.inOut',
      absolute: true,
    });
  });

  card.animation = animation;
  card.animation.play();
};

export const handleModalClick = (
  images: HTMLDivElement[],
  tracker: { item: number },
  modal: HTMLDivElement,
) => {
  const activeCard = images[tracker.item] as AnimatedHTMLDivElement;
  const faces = activeCard.querySelector('.faces');

  const animation = gsap.timeline({ paused: true });
  animation.set(activeCard, { opacity: 1 });
  animation.add(function () {
    activeCard.dataset.flipId = 'wheel__card';

    const state = Flip.getState([modal, activeCard], {
      props: 'borderRadius, aspectRatio, boxShadow',
    });

    modal.classList.remove('active');

    Flip.from(state, {
      duration: 1,
      absolute: true,
      ease: 'sine.inOut',
      onComplete: () => {
        activeCard.dataset.flipId = 'wheel__card';
        animation.to(faces, { rotationY: 0 }).eventCallback('onComplete', () => {
          // Ensure the state is updated after the animation completes
          activeCard.dataset.flipId = '';
        });
        // animation.to(faces, { rotationY: 0 });
      },
    });
  });

  activeCard.animation = animation;
  activeCard.animation.play();
};

export const handleWheel = (
  deltaY: number,
  images: HTMLDivElement[],
  tl: gsap.core.Timeline,
  tracker: { item: number },
) => {
  const direction = deltaY > 0 ? -1 : 1;
  const total = images.length;

  console.log('실행 전: ', tl.progress());
  // TODO: 스크롤 이벤트가 제대로 작동하지 않음
  gsap.to(tl, {
    progress: snap(total)(tl.progress() + direction / total),
    modifiers: {
      progress: wrapProgress,
    },
    onComplete: () => {
      console.log('실행 후: ', tl.progress());
    },
  });

  const next = (tracker.item - direction + total) % total;
  setActiveImage(images, next);
};
