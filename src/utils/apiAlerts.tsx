import React from 'react';

export const apiAlerts = [
  {
    content: (
      <>
        Version 0 of the VA Facilities API is deprecated and scheduled for deactivation on June 1,
        2024. Version 1 of the VA Facilities API is now active.
      </>
    ),
    path: '/explore/api/va-facilities',
    status: 'warning',
  },
  {
    content: (
      <>
        Version 0 of the Veteran Confirmation API is deprecated and scheduled for deactivation on
        October 4, 2024. Version 1 of the Veteran Confirmation API is now active.
      </>
    ),
    path: '/explore/api/veteran-confirmation',
    status: 'warning',
  },
  {
    content: (
      <>
        Veteran Service History and Eligibility Version 1 is deprecated and scheduled for
        deactivation on May 30, 2024. Version 2 is active.
      </>
    ),
    path: '/explore/api/veteran-service-history-and-eligibility',
    status: 'warning',
  },
];
