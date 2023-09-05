import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Center,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Contact } from "../../interfaces/GetContactListResponse";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleDeleteContactCommit: (id: number) => void;
  contact: Contact | null;
  setDeleteConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  setDeleteConfirmation,
  onClose,
  handleDeleteContactCommit,
  contact,
}) => {
  const toast = useToast();

  const handleDeletion: React.MouseEventHandler<HTMLButtonElement> = () => {
    try {
      handleDeleteContactCommit(contact?.id || 0);

      setDeleteConfirmation(true);

      const storedFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      localStorage.setItem(
        "favorites",
        JSON.stringify(
          storedFavorites.filter((item: string) => item !== `${contact?.name}`)
        )
      );

      localStorage.removeItem(contact?.name || "");
      localStorage.removeItem(`default-${contact?.name}`);

      toast({
        title: "Contact deleted.",
        description: `${contact?.name} has been deleted.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error occurred.",
        description: `Check console for details.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.error(error);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
      <ModalOverlay />
      <ModalContent
        marginY="auto"
        marginBottom="2rem"
        bgColor="gray.900"
        borderRadius="3xl"
      >
        <ModalHeader>Confirm Deletion</ModalHeader>
        <ModalBody>
          <Text>Are you sure you want to delete this contact?</Text>
        </ModalBody>
        <ModalFooter>
          <Center width="100%">
            <Button variant="ghost" onClick={onClose} marginRight="1rem">
              Cancel
            </Button>
            <Button variant="ghost" onClick={handleDeletion} marginLeft="1rem">
              Confirm
            </Button>
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
