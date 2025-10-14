import React from "react";
import { Button, Typography } from "@react-lab-mono/ui";

type Props = {
  onClearError?: () => void;
};

export const ErrorPage: React.FC<Props> = ({ onClearError }) => {
  const handleBackHome = () => {
    onClearError?.();
    window.location.href = "/";
  };

  return (
    <div>
      <Typography type="h2">Something is not right!</Typography>
      <Button fillMode="outline" onClick={handleBackHome}>
        Go Back Home
      </Button>
    </div>
  );
};
