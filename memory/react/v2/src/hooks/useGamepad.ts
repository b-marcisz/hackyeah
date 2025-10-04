import { useEffect, useState, useCallback } from 'react';

export type GamepadButton = 'up' | 'down' | 'left' | 'right' | 'a' | 'b' | 'start';

interface UseGamepadOptions {
  onButtonPress?: (button: GamepadButton) => void;
}

export function useGamepad({ onButtonPress }: UseGamepadOptions = {}) {
  const [isGamepadConnected, setIsGamepadConnected] = useState(false);
  const [pressedButtons, setPressedButtons] = useState<Set<number>>(new Set());

  const handleGamepadConnected = useCallback((e: any) => {
    console.log('Gamepad connected:', e.gamepad?.id);
    setIsGamepadConnected(true);
  }, []);

  const handleGamepadDisconnected = useCallback((e: any) => {
    console.log('Gamepad disconnected:', e.gamepad?.id);
    setIsGamepadConnected(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [handleGamepadConnected, handleGamepadDisconnected]);

  useEffect(() => {
    if (typeof window === 'undefined' || !onButtonPress) return;
    if (!isGamepadConnected) return;

    const pollGamepad = () => {
      if (!navigator.getGamepads) return;
      const gamepads = navigator.getGamepads();
      const gamepad = gamepads[0];

      if (!gamepad) return;

      // D-pad or left stick
      const axes = gamepad.axes;
      const buttons = gamepad.buttons;

      // Check D-pad (axes[9] = horizontal, axes[10] = vertical on some controllers)
      // Or left stick (axes[0] = horizontal, axes[1] = vertical)
      const horizontal = axes[0];
      const vertical = axes[1];

      // Detect direction changes
      if (horizontal < -0.5 && !pressedButtons.has(100)) {
        onButtonPress('left');
        setPressedButtons(prev => new Set(prev).add(100));
      } else if (horizontal > 0.5 && !pressedButtons.has(101)) {
        onButtonPress('right');
        setPressedButtons(prev => new Set(prev).add(101));
      } else if (Math.abs(horizontal) < 0.3) {
        setPressedButtons(prev => {
          const next = new Set(prev);
          next.delete(100);
          next.delete(101);
          return next;
        });
      }

      if (vertical < -0.5 && !pressedButtons.has(102)) {
        onButtonPress('up');
        setPressedButtons(prev => new Set(prev).add(102));
      } else if (vertical > 0.5 && !pressedButtons.has(103)) {
        onButtonPress('down');
        setPressedButtons(prev => new Set(prev).add(103));
      } else if (Math.abs(vertical) < 0.3) {
        setPressedButtons(prev => {
          const next = new Set(prev);
          next.delete(102);
          next.delete(103);
          return next;
        });
      }

      // A button (usually index 0)
      if (buttons[0]?.pressed && !pressedButtons.has(0)) {
        onButtonPress('a');
        setPressedButtons(prev => new Set(prev).add(0));
      } else if (!buttons[0]?.pressed && pressedButtons.has(0)) {
        setPressedButtons(prev => {
          const next = new Set(prev);
          next.delete(0);
          return next;
        });
      }

      // B button (usually index 1)
      if (buttons[1]?.pressed && !pressedButtons.has(1)) {
        onButtonPress('b');
        setPressedButtons(prev => new Set(prev).add(1));
      } else if (!buttons[1]?.pressed && pressedButtons.has(1)) {
        setPressedButtons(prev => {
          const next = new Set(prev);
          next.delete(1);
          return next;
        });
      }

      // Start button (usually index 9)
      if (buttons[9]?.pressed && !pressedButtons.has(9)) {
        onButtonPress('start');
        setPressedButtons(prev => new Set(prev).add(9));
      } else if (!buttons[9]?.pressed && pressedButtons.has(9)) {
        setPressedButtons(prev => {
          const next = new Set(prev);
          next.delete(9);
          return next;
        });
      }
    };

    const interval = setInterval(pollGamepad, 100);
    return () => clearInterval(interval);
  }, [isGamepadConnected, onButtonPress, pressedButtons]);

  return { isGamepadConnected };
}
