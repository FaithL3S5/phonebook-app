import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Radio,
  RadioGroup,
  Button,
  Center,
  Stack,
  Divider,
} from "@chakra-ui/react";
import { Contact } from "../../interfaces/GetContactListResponse";

interface SetAsDefaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onSetDefault: (selectedNumber: string) => void;
}

const SetAsDefaultModal: React.FC<SetAsDefaultModalProps> = ({
  isOpen,
  onClose,
  contact,
  onSetDefault,
}) => {
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

  useEffect(() => {
    if (contact) {
      setSelectedPhoneNumber(
        localStorage.getItem(`default-${contact.name}`) ||
          (contact.phones.length > 0 ? contact.phones[0].number : "")
      );
    }
  }, [contact]);

  const handleSetDefault = () => {
    if (contact) {
      localStorage.setItem(`default-${contact.name}`, selectedPhoneNumber);
    }
    onSetDefault(selectedPhoneNumber);
    onClose();
  };

  const closeHandler = () => {
    if (contact) {
      setSelectedPhoneNumber(
        localStorage.getItem(`default-${contact.name}`) ||
          (contact.phones.length > 0 ? contact.phones[0].number : "")
      );
    }
    onClose();
  };

  const defaultPhoneNumber = contact
    ? localStorage.getItem(`default-${contact.name}`) ||
      (contact.phones.length > 0 ? contact.phones[0].number : "")
    : "";

  return (
    <Modal isOpen={isOpen} onClose={closeHandler} isCentered size="xs">
      <ModalOverlay />
      <ModalContent
        marginY="auto"
        marginBottom="2rem"
        bgColor="gray.900"
        borderRadius="3xl"
      >
        <ModalHeader>{contact?.name}</ModalHeader>
        <ModalBody>
          <RadioGroup
            onChange={setSelectedPhoneNumber}
            value={selectedPhoneNumber}
            defaultValue={defaultPhoneNumber}
          >
            <Stack spacing={3}>
              {contact?.phones
                .map((phone) => phone.number)
                .map((number, index) => (
                  <Radio key={index} value={number}>
                    {number}
                  </Radio>
                ))}
            </Stack>
          </RadioGroup>
        </ModalBody>

        <ModalFooter>
          <Center width="100%">
            <Button variant="ghost" onClick={closeHandler} marginRight="1rem">
              Cancel
            </Button>
            <Divider orientation="vertical" height="20px" />
            <Button
              variant="ghost"
              onClick={handleSetDefault}
              marginLeft="1rem"
            >
              Set as Default
            </Button>
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SetAsDefaultModal;
