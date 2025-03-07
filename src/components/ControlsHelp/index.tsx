import { useState } from 'preact/hooks';
import {
  ArrowDownOnSquareIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

import Storage from '../../storage';

import './index.css';

export const ControlsHelp = ({
  isCardRevealed,
  isHidingAllowed,
}: {
  isCardRevealed: boolean;
  isHidingAllowed: boolean;
}) => {
  const [isHidden, setHidden] = useState(Storage.get('hideControls'));
  const hasTouchSupport = Boolean(window.TouchEvent);

  const hideControls = (_event: MouseEvent) => {
    Storage.set('hideControls', true);
    setHidden(true);
  };

  const showControls = (_event: MouseEvent) => {
    Storage.remove('hideControls');
    setHidden(false);
  };

  const controls = (
    <div className={`controlsHelp ${isHidden ? 'hidden' : ''}`}>
      <h4>Controls</h4>
      <div className="controlsHelp__keys">
        {!isCardRevealed ? (
          <>
            {hasTouchSupport ? (
              <div>
                <ArrowDownOnSquareIcon className="icon" />
                swipe card down to reveal
              </div>
            ) : (
              <div className="flex">
                <kbd>↓</kbd>
                <div>reveal card</div>
              </div>
            )}
          </>
        ) : (
          <>
            {hasTouchSupport ? (
              <div>
                <ArrowRightStartOnRectangleIcon className="icon" />
                swipe card right to mark as correct
              </div>
            ) : (
              <div className="flex">
                <kbd>→</kbd>
                <div>mark as correct</div>
              </div>
            )}
            {hasTouchSupport ? (
              <div>
                <ArrowLeftStartOnRectangleIcon className="icon" />
                swipe card left to mark as incorrect
              </div>
            ) : (
              <div className="flex">
                <kbd>←</kbd>
                <div>mark as incorrect</div>
              </div>
            )}
          </>
        )}
      </div>
      {isHidingAllowed && (
        <div className="controlsHelp__buttonContainer">
          <button className="col-span-2" onClick={hideControls}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );

  const helpButton = (
    <button className="helpButton" onClick={showControls}>
      <QuestionMarkCircleIcon className="icon" />
    </button>
  );

  return isHidden ? helpButton : controls;
};
