import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardContent, Paper, StepButton } from "@mui/material";
import { FinishCompanyContet } from "./AddCompanyContent";
import { FinishProductContent } from "./AddProductContent";
import { FinishAddClient } from "./AddClientContent";

import AddPickBank from "./AddPickBank";
import { api } from "../../../utils/api";
import BankovniRacuni from "../../../pages/dashboard/bankovni-racuni";

const steps = [
  {
    label: "Unesite podatke o svom poduzeću",
    component: <FinishCompanyContet />,
  },
  {
    label: "Dodajte prvi proizvod ili uslugu",
    component: <FinishProductContent />,
  },
  { label: "Dodajte prvog klijenta", component: <FinishAddClient /> },
  { label: "Stvorite prvi račun", component: "" },
  {
    label: "Povežite bankovni račun",
    component: <AddPickBank />,
  },
];

export function OnBoarding() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  return (
    <Box sx={{ width: "100%" }}>
      <div
        style={{
          margin: 35,
          height: 50,

          textAlign: "center",
        }}
      >
        <Paper
          sx={{
            minWidth: 750,
            width: "100%",
            mb: 2,
            borderRadius: 5,
            paddingTop: 10,
            marginTop: 5,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map(({ label }, index) => (
                <Step key={label} completed={completed[index]}>
                  <StepButton onClick={handleStep(index)}>{label}</StepButton>
                </Step>
              ))}
            </Stepper>

            <div>
              {allStepsCompleted() ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
              ) : (
                <Box>
                  <CardContent>{steps[activeStep]?.component}</CardContent>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Nazad
                      </Button>
                    )}

                    <Button onClick={handleComplete} sx={{ mt: 3, ml: 1 }}>
                      {completedSteps() === totalSteps() - 1
                        ? "Završi"
                        : "Dalje"}
                    </Button>
                  </Box>
                </Box>
              )}
            </div>
          </Box>
        </Paper>
      </div>
    </Box>
  );
}
