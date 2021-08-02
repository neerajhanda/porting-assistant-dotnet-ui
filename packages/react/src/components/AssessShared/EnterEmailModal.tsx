import { Box, Button, FormField, Input, Modal, SpaceBetween } from "@awsui/components-react";
import { MemoryHistory } from "history";
import React from "react";
import { useHistory } from "react-router-dom";

interface Props {
  visible: boolean;
  onSaveExit?: any;
}

// This function simply checks if the email is currently set
// It is designed to be used when implementing the EnterEmailModal
// However, it does not have to be used if the implementer
// wants to use their own functionality
// Use it to determine whether or not to display the modal
export const isEmailSet = () => {
  const email = window.electron.getState("email");
  if (email === "" || email == null) {
    return false;
  }
  return true;
};

export const EnterEmailModal: React.FC<Props> = React.memo(({ visible, onSaveExit }) => {
  const [isVisible, setVisible] = React.useState(visible);
  const [emailValue, setEmailValue] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const history = useHistory() as MemoryHistory;

  // Used to check if the email string is valid, e.g. example@amazon.com
  const validEmail = new RegExp(`^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$`);

  const saveAndClose = () => {
    // Validate
    if (validEmail.test(emailValue)) {
      // email is valid, save
      window.electron.saveState("email", emailValue);
      setVisible(false);
      if (onSaveExit) {
        onSaveExit();
      }
    } else {
      // invalid email
      setEmailError("Invalid e-mail format.");
    }
  };

  const exitWithoutSave = () => {
    setVisible(false);
    history.goBack();
  };

  return (
    <Modal
      onDismiss={() => exitWithoutSave()}
      visible={isVisible}
      closeAriaLabel="Close modal"
      size="medium"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => exitWithoutSave()}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => saveAndClose()}>
              Save
            </Button>
          </SpaceBetween>
        </Box>
      }
      header="E-mail required"
    >
      <SpaceBetween direction="vertical" size="m">
        <Box>
          We require your e-mail to use this feature. It looks like you have not provided your email yet. Please enter
          your e-mail below. You may change it at anytime in Settings.
        </Box>
        <FormField
          label="E-mail"
          description="We use this to contact you regarding any feedback or contributions to Porting Assistant."
          errorText={emailError}
        >
          <Input
            onChange={({ detail }) => setEmailValue(detail.value)}
            value={emailValue}
            placeholder="example@amazon.com"
          />
        </FormField>
        <Box>
          This action saves your e-mail locally on your machine. Your e-mail is never sent to our team without your
          permission.
        </Box>
      </SpaceBetween>
    </Modal>
  );
});
