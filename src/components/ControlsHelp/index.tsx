import { useState } from 'preact/hooks';

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

  return (
    !isHidden && (
      <div className={`controlsHelp ${isHidden ? 'hidden' : ''}`}>
        <h4>Controls</h4>
        <div className="controlsHelp__keys">
          {!isCardRevealed ? (
            <>
              <div>
                <kbd>{hasTouchSupport ? 'swipe down' : '↓'}</kbd>
                <div>reveal card</div>
              </div>
            </>
          ) : (
            <>
              <div>
                <kbd>{hasTouchSupport ? 'swipe right' : '→'}</kbd>
                <div>mark as correct</div>
              </div>
              <div>
                <kbd>{hasTouchSupport ? 'swipe left' : '←'}</kbd>
                <div>mark as incorrect</div>
              </div>
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
    )
  );
};
