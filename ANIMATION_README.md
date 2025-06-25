# Scroll-Triggered Fade-Up Animation System

A complete, accessible, and performant scroll-triggered animation system for your personal website with **reversible animations**.

## Features

✅ **Reversible Animations**: Elements animate in AND out every time they enter/leave viewport  
✅ **Smooth Transitions**: Fade in + slide up with professional easing  
✅ **Smart Triggering**: Animates when elements are 20% visible  
✅ **Infinite Repeatability**: Works every time you scroll past content  
✅ **Accessibility**: Respects `prefers-reduced-motion`  
✅ **Performance**: Hardware-accelerated CSS transforms  
✅ **Fallback**: Elements visible by default if JS fails  
✅ **React Ready**: Works seamlessly with React components  
✅ **Multiple Variants**: Different animation styles available  
✅ **No Teleporting**: Smooth transitions from hidden to visible state  

## Quick Start

### 1. Basic Usage

Add the `data-animate="fade-up"` attribute to any element you want to animate:

```html
<div data-animate="fade-up">
  <h1>This will fade up when scrolled into view</h1>
</div>

<section data-animate="fade-up">
  <p>This section will also animate</p>
</section>
```

### 2. Reversible Animation Behavior

The animations now work in both directions:

- **Scroll Down**: Elements fade in and slide up when entering viewport
- **Scroll Up**: Elements fade out and slide down when leaving viewport
- **Repeat**: This works infinitely - every time you scroll past content

### 3. Available Animation Variants

#### Standard Fade-Up (Default)
```html
<div data-animate="fade-up">
  <!-- 32px slide up/down, 400ms duration -->
</div>
```

#### Subtle Fade-Up
```html
<div data-animate="fade-up-subtle">
  <!-- 16px slide up/down, 300ms duration -->
</div>
```

#### Slow Fade-Up
```html
<div data-animate="fade-up-slow">
  <!-- 48px slide up/down, 600ms duration -->
</div>
```

### 4. React Component Usage

The system automatically works with React components. Just add the data attribute:

```tsx
function MyComponent() {
  return (
    <div data-animate="fade-up" className="my-component">
      <h2>Animated React Component</h2>
      <p>This will animate when scrolled into view</p>
    </div>
  );
}
```

## How It Works

### CSS Structure

The system uses a smart CSS approach to ensure smooth reversible animations:

1. **Elements start hidden**: All animated elements begin with `opacity: 0` and `transform: translateY(32px)`
2. **Transition is always active**: The CSS transition is applied immediately, not when the element becomes visible
3. **Two states**: Elements smoothly transition between hidden (`.fade-up-init`) and visible (`.is-visible`) states

```css
[data-animate="fade-up"] {
  /* Transition is always active */
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Start hidden */
  opacity: 0;
  transform: translateY(32px);
}

[data-animate="fade-up"].is-visible {
  /* Smoothly transition to visible */
  opacity: 1;
  transform: translateY(0);
}

[data-animate="fade-up"].fade-up-init {
  /* Smoothly transition back to hidden */
  opacity: 0;
  transform: translateY(32px);
}
```

### JavaScript Logic

1. **IntersectionObserver**: Watches for elements entering AND leaving the viewport
2. **Reversible Logic**: 
   - When `isIntersecting` is `true`: Add `.is-visible` class (animate in)
   - When `isIntersecting` is `false`: Add `.fade-up-init` class (animate out)
3. **Continuous Observation**: Elements are never unobserved, allowing infinite repetition
4. **Immediate Response**: No stagger delays for individual elements

## Configuration Options

### Customizing Animation Behavior

You can customize the animation behavior by passing options:

```typescript
import { initFadeUpAnimations } from './utils/scrollFadeUp';

initFadeUpAnimations({
  stagger: 0,        // No stagger for reversible animations
  threshold: 0.2,    // Trigger when 20% visible
  rootMargin: '0px 0px -10% 0px'  // Custom trigger area
});
```

### Available Options

| Option | Default | Description |
|--------|---------|-------------|
| `stagger` | `0` | No stagger for reversible animations |
| `threshold` | `0.2` | Trigger when element is this % visible (0-1) |
| `rootMargin` | `'0px 0px -10% 0px'` | Custom trigger area (CSS margin format) |

## CSS Customization

### Animation Timing

The animations use smooth cubic-bezier easing curves:

```css
/* Standard: 400ms with smooth easing */
[data-animate="fade-up"] {
  transition: 
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Subtle: 300ms for faster feel */
[data-animate="fade-up-subtle"] {
  transition: 
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slow: 600ms for dramatic effect */
[data-animate="fade-up-slow"] {
  transition: 
    opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Creating Custom Variants

Add your own animation variants:

```css
[data-animate="fade-up-custom"] {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
  
  opacity: 0;
  transform: translateY(24px) scale(0.95);
}

[data-animate="fade-up-custom"].is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

[data-animate="fade-up-custom"].fade-up-init {
  opacity: 0;
  transform: translateY(24px) scale(0.95);
}
```

## Accessibility

### Reduced Motion Support

The system automatically respects user preferences:

- **`prefers-reduced-motion: reduce`**: Animations are disabled, elements appear instantly
- **`prefers-reduced-motion: no-preference`**: Full animations with hardware acceleration

### Screen Reader Friendly

- Elements are visible by default (no content hiding)
- Animations don't interfere with screen readers
- No ARIA attributes needed

## Performance Optimizations

### Built-in Optimizations

- **Hardware Acceleration**: Uses `transform` and `opacity` for GPU acceleration
- **CSS Containment**: `contain: layout style paint` prevents layout thrashing
- **Efficient Observers**: IntersectionObserver with passive listeners
- **Continuous Observation**: Elements stay observed for infinite repetition
- **Immediate Response**: No delays for smooth user experience

### Best Practices

1. **Don't overuse**: Limit animations to key content sections
2. **Consider performance**: Reversible animations can be more CPU intensive
3. **Test on mobile**: Ensure smooth performance on lower-end devices

## Browser Support

- **Modern Browsers**: Full support (Chrome 51+, Firefox 55+, Safari 12.1+)
- **IntersectionObserver**: Required for animations
- **Fallback**: Elements visible by default in unsupported browsers

## Troubleshooting

### Animations Not Working

1. **Check console**: Look for initialization messages
2. **Verify data attributes**: Ensure `data-animate="fade-up"` is present
3. **Check IntersectionObserver support**: Should work in all modern browsers

### Performance Issues

1. **Reduce animation count**: Limit the number of animated elements
2. **Use subtle variants**: Try `fade-up-subtle` for less movement
3. **Test scroll speed**: Very fast scrolling might cause performance issues

### React-Specific Issues

1. **Dynamic content**: Use `reinitFadeUpAnimations()` after content changes
2. **Route changes**: Animations reinitialize automatically on navigation
3. **Component updates**: Use the `useFadeUpAnimation` hook for manual control

## Examples

### Blog Post List

```tsx
function BlogList({ posts }) {
  return (
    <div className="blog-list">
      {posts.map((post, index) => (
        <article 
          key={post.id} 
          data-animate="fade-up"
          className="blog-card"
        >
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Project Grid

```tsx
function ProjectGrid({ projects }) {
  return (
    <div className="project-grid">
      {projects.map((project, index) => (
        <div 
          key={project.id}
          data-animate="fade-up-slow"
          className="project-card"
        >
          <img src={project.image} alt={project.title} />
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Hero Section

```tsx
function HeroSection() {
  return (
    <section className="hero">
      <h1 data-animate="fade-up">Welcome to My Portfolio</h1>
      <p data-animate="fade-up-subtle">Frontend Developer & Designer</p>
      <button data-animate="fade-up-slow" className="cta-button">
        View My Work
      </button>
    </section>
  );
}
```

## API Reference

### Functions

#### `initFadeUpAnimations(stagger?)`
Initialize the animation system with reversible animations.

### CSS Classes

- `.is-visible`: Animated visible state
- `.fade-up-init`: Animated hidden state

### Data Attributes

- `data-animate="fade-up"`: Standard reversible animation
- `data-animate="fade-up-subtle"`: Subtle reversible animation
- `data-animate="fade-up-slow"`: Slow reversible animation

## Technical Details

### Why This Approach Works

1. **CSS-First**: Transitions are defined in CSS, not JavaScript
2. **State-Based**: Elements have clear hidden/visible states
3. **Performance**: Uses hardware-accelerated properties
4. **Reversible**: IntersectionObserver tracks both entry and exit
5. **Accessible**: Respects user motion preferences

### Animation Flow

1. Element starts with `opacity: 0, transform: translateY(32px)`
2. CSS transition is always active
3. IntersectionObserver detects element entering viewport
4. `.is-visible` class added → element animates to `opacity: 1, transform: translateY(0)`
5. IntersectionObserver detects element leaving viewport
6. `.fade-up-init` class added → element animates back to `opacity: 0, transform: translateY(32px)`
7. Process repeats infinitely

---

This animation system provides a professional, accessible, and performant way to add reversible scroll-triggered animations to your personal website. The implementation ensures smooth fade-up animations that work in both directions, creating a dynamic and engaging user experience. 