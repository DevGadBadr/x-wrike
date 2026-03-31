import * as React from "react";

import { BaseTemplate } from "@/emails/base-template";

type WelcomeEmailProps = {
  fullName: string;
  workspaceName: string;
  dashboardUrl: string;
};

export function WelcomeEmail(props: WelcomeEmailProps) {
  return (
    <BaseTemplate
      preview="Your account is ready and your workspace access is active."
      heading="Welcome to XManager"
      greeting={`Welcome ${props.fullName},`}
      context={`Your profile has been completed and you now have access to the ${props.workspaceName} workspace in XManager.`}
      ctaLabel="Go to Dashboard"
      ctaUrl={props.dashboardUrl}
      fallbackLabel="Open XManager"
      footer="We recommend reviewing your assigned teams, projects, and tasks after sign-in."
    />
  );
}
