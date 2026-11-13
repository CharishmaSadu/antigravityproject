import React from 'react';
import { FarmSetupWizard } from '../components/FarmSetupWizard';

export const FarmSetupPage: React.FC = () => {
  return (
    <div className="py-6 sm:py-10">
      <FarmSetupWizard />
    </div>
  );
};
