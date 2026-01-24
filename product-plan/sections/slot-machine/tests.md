# Slot Machine Tests

## User Flows

### First Spin of the Day
1. User opens app, sees slot machine with enabled "SPIN" button
2. User taps "SPIN"
3. All three reels begin spinning (blurred, rapid word cycling)
4. Reel 1 stops first (~1s), revealing first word
5. Reel 2 stops second (~1.8s), revealing second word
6. Reel 3 stops last (~2.6s), revealing third word
7. Celebration animation plays (sparkles, golden glow)
8. Full prompt displayed below reels
9. Spin button becomes disabled
10. Countdown timer appears showing time until next spin

### Already Spun Today
1. User opens app after spinning earlier today
2. Slot machine shows today's prompt in the display area
3. Spin button is disabled (grayed out)
4. Countdown timer shows "Xh Xm until next spin"
5. Tapping disabled button does nothing

### Return After Midnight
1. User spun yesterday, returns after midnight
2. Slot machine shows enabled "SPIN" button
3. Previous prompt no longer displayed (or shown in history)
4. User can spin again

## Empty States

### New User (No Prompts Yet)
- Slot machine displays with enabled spin button
- Placeholder text: "Tap SPIN to get today's prompt"
- No countdown timer visible

## Edge Cases

### Rapid Tap Prevention
- If user taps spin rapidly, only first tap registers
- Subsequent taps during spin animation are ignored

### Network/Storage Error
- If prompt fails to save, show error message
- Allow retry without counting as daily spin

### Midnight Boundary
- Spin at 11:59pm should work normally
- Next spin available after local midnight

## Component States

### SpinButton States
- **Enabled**: Purple gradient, hover effects, clickable
- **Disabled**: Gray gradient, no hover effects, cursor-not-allowed
- **Spinning**: Purple with pulse animation, shows "SPINNING..."

### Reel States
- **Idle with word**: Shows single word, slight golden ring
- **Spinning**: Blur effect, rapid word cycling
- **Stopping**: Decreasing speed, blur fading
- **Stopped**: Clear word display, golden highlight ring

## Accessibility

- Spin button has appropriate disabled state
- Animation respects `prefers-reduced-motion`
- Screen reader announces prompt result after spin
- Countdown timer has appropriate ARIA live region
