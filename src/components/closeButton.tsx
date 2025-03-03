import { Link } from 'wouter-preact';
import { XMarkIcon } from '@heroicons/react/24/outline';

import './closeIcon.css';

export const CloseButton = ({ returnTo }: { returnTo: string }) => {
  return (
    <div className="closeIcon">
      <Link to={returnTo}>
        <XMarkIcon className="icon" />
      </Link>
    </div>
  );
};
