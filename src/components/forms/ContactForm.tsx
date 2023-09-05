import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  IconButton,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import AddIcon from "@mui/icons-material/Add";
import {
  GetContactListResponse,
  Phone,
} from "../../interfaces/GetContactListResponse";
import { Contact } from "../../interfaces/GetContactListResponse";
import { ApolloError } from "@apollo/client";

interface ContactFormProps {
  onCancelOrSave: () => void;
  contact: Contact | null;
  loading: boolean;
  error: ApolloError | undefined;
  data: GetContactListResponse | undefined;
  refetch: () => void;
  contactListChanged: boolean;
  setContactListChanged: React.Dispatch<React.SetStateAction<boolean>>;
  handleNameChangeCommit: (
    id: number,
    firstName: string,
    lastName: string
  ) => void;
  handleNameAddCommit: (
    firstName: string,
    lastName: string,
    phones: Phone[]
  ) => void;
  handlePhoneChangeCommit: (
    id: number,
    oldNumber: string,
    newNumber: string
  ) => void;
  handlePhoneAddCommit: (id: number, newNumber: string) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onCancelOrSave,
  contact,
  setContactListChanged,
  handleNameChangeCommit,
  handleNameAddCommit,
  handlePhoneChangeCommit,
  handlePhoneAddCommit,
  isEditing,
  setIsEditing,
}) => {
  const initialPhoneNumbers = contact
    ? contact.phones.map((phone) => phone.number)
    : [""];

  const maxPhoneNumbers = 5;

  const [phoneNumbers, setPhoneNumbers] =
    useState<string[]>(initialPhoneNumbers);
  const [phoneCheck, setPhoneCheck] = useState<Phone[]>([{ number: "" }]);
  const [nameCheck, setNameCheck] = useState({
    firstName: "",
    lastName: "",
  });

  const phonePattern = /^[0-9+]*$/;
  const namePattern = /^[\p{L}\s]*$/u;

  const toast = useToast();

  const handleAddPhoneNumber = () => {
    if (phoneNumbers.length < maxPhoneNumbers) {
      setPhoneNumbers([...phoneNumbers, ""]);
    }
  };

  // const handleRemovePhoneNumber = (index: number) => {
  //   // Create a new array without the phone number at the specified index
  //   const newPhoneNumbers = phoneNumbers.filter((_, idx) => idx !== index);
  //   const newPhoneCheck = phoneCheck.filter((_, idx) => idx !== index);

  //   // Update the state with the new arrays
  //   setPhoneNumbers(newPhoneNumbers);
  //   setPhoneCheck(newPhoneCheck);
  // };

  function handlePhoneNumbers(newArray: Phone[]) {
    for (let i = 0; i < newArray.length; i++) {
      const newNumber = newArray[i].number;
      const defaultNumber = contact?.phones[i] && contact?.phones[i].number;

      if (defaultNumber && newNumber !== defaultNumber) {
        try {
          handlePhoneChangeCommit(
            contact?.id || 0,
            contact?.phones[i].number,
            newArray[i].number
          );
          localStorage.setItem(
            `default-${nameCheck.firstName} ${nameCheck.lastName}`,
            newArray[i].number
          );
          toast({
            title: "Existing phone number edited.",
            description: `${nameCheck.firstName} phone number has been edited.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setNameCheck({ firstName: "", lastName: "" });
          setPhoneNumbers([""]);
          setPhoneCheck([{ number: "" }]);
          setContactListChanged(true);
          onCancelOrSave();
        } catch (error) {
          toast({
            title: "Error occurred while updating phone number.",
            description: `Check console for details.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          console.error(error);
          setNameCheck({ firstName: "", lastName: "" });
          setPhoneNumbers([""]);
          setPhoneCheck([{ number: "" }]);
          setContactListChanged(true);
          onCancelOrSave();
        }
      }
      // If the phone number doesn't exist in the default array
      else if (!defaultNumber) {
        try {
          handlePhoneAddCommit(contact?.id || 0, newArray[i].number);
          toast({
            title: "New phone number added.",
            description: `${nameCheck.firstName} phone number has been added.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setNameCheck({ firstName: "", lastName: "" });
          setPhoneNumbers([""]);
          setPhoneCheck([{ number: "" }]);
          setContactListChanged(true);
          onCancelOrSave();
        } catch (error) {
          toast({
            title: "Error occurred while updating phone number.",
            description: `Check console for details.`,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          console.error(error);
          setNameCheck({ firstName: "", lastName: "" });
          setPhoneNumbers([""]);
          setPhoneCheck([{ number: "" }]);
          setContactListChanged(true);
          onCancelOrSave();
        }
      }
    }
  }

  const handleSave = async () => {
    if (!isEditing) {
      if (
        contact?.first_name !== nameCheck.firstName ||
        contact?.last_name !== nameCheck.lastName
      ) {
        try {
          handleNameAddCommit(
            nameCheck.firstName,
            nameCheck.lastName,
            phoneCheck
          );
          // Handle success (e.g., show a success message, reset the form, etc.)
          localStorage.setItem(
            `default-${nameCheck.firstName} ${nameCheck.lastName}`,
            phoneCheck[0].number
          );
          toast({
            title: "New contact created.",
            description: `${nameCheck.firstName} has been added.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setNameCheck({ firstName: "", lastName: "" });
          setPhoneNumbers([""]);
          setPhoneCheck([{ number: "" }]);
          setContactListChanged(true);
          onCancelOrSave();
        } catch (error) {
          // Handle error (e.g., show an error message)
          console.error(error);
        }
      } else {
        toast({
          title: "Contact creation failed.",
          description: `New contact name must be unique.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        console.error("New contact&#39;s name must be unique.");
      }
    } else {
      if (
        `${contact?.first_name} ${contact?.last_name}` !==
        `${nameCheck.firstName} ${nameCheck.lastName}`
      ) {
        try {
          handleNameChangeCommit(
            contact?.id || 0,
            nameCheck.firstName,
            nameCheck.lastName
          );
          localStorage.removeItem(
            `default-${contact?.first_name} ${contact?.last_name}`
          );
          localStorage.setItem(
            `default-${nameCheck.firstName} ${nameCheck.lastName}`,
            phoneCheck[0].number
          );
          toast({
            title: "Existing contact edited.",
            description: `${nameCheck.firstName} has been edited.`,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          setNameCheck({ firstName: "", lastName: "" });
          setPhoneNumbers([""]);
          setPhoneCheck([{ number: "" }]);
          setContactListChanged(true);
          onCancelOrSave();
        } catch (error) {
          // Handle error (e.g., show an error message)
          toast({
            title: "No changes were made.",
            description: `${nameCheck.firstName} has not been edited.`,
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          console.error(error);
        }
      } else {
        setNameCheck({ firstName: "", lastName: "" });
        setPhoneNumbers([""]);
        setPhoneCheck([{ number: "" }]);
        setContactListChanged(true);
        setIsEditing(false);
        onCancelOrSave();
      }

      handlePhoneNumbers(phoneCheck);
    }
  };

  const handleCancel = () => {
    setNameCheck({ firstName: "", lastName: "" });
    setPhoneNumbers([""]);
    setPhoneCheck([{ number: "" }]);
    onCancelOrSave();
  };

  useEffect(() => {
    if (contact) {
      setNameCheck({
        firstName: contact.first_name || "",
        lastName: contact.last_name || "",
      });
      setPhoneCheck(contact.phones);
      setPhoneNumbers(contact.phones.map((phone) => phone.number));
    }
  }, [contact]);

  return (
    <Box padding="1rem" width="100%">
      <Card borderRadius="3xl" marginBottom="1rem" bgColor="gray.900">
        <CardBody>
          <Flex direction="row" alignItems="flex-start">
            <Flex
              flex="1"
              alignItems="flex-start"
              justifyContent="center"
              height="100%"
            >
              <PersonIcon fontSize="small" style={{ marginTop: "14px" }} />
            </Flex>
            <Box flex="8">
              <>
                <Input
                  placeholder="First Name"
                  bgColor="gray.900"
                  isRequired
                  borderColor="gray.700"
                  variant="flushed"
                  maxLength={40}
                  value={nameCheck.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (
                      namePattern.test(e.target.value) ||
                      e.target.value === ""
                    ) {
                      setNameCheck((prev) => {
                        return {
                          ...prev,
                          firstName: e.target.value,
                        };
                      });
                    }
                  }}
                />
                <Input
                  placeholder="Last Name"
                  bgColor="gray.900"
                  isRequired
                  borderColor="gray.700"
                  variant="flushed"
                  maxLength={40}
                  value={nameCheck.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (
                      namePattern.test(e.target.value) ||
                      e.target.value === ""
                    ) {
                      setNameCheck((prev) => {
                        return {
                          ...prev,
                          lastName: e.target.value,
                        };
                      });
                    }
                  }}
                />
              </>
            </Box>
            <Flex
              flex="1"
              alignItems="center"
              justifyContent="center"
              height="100%"
            ></Flex>
          </Flex>
        </CardBody>
      </Card>
      <Card borderRadius="3xl" marginBottom="1rem" bgColor="gray.900">
        <CardBody>
          {phoneNumbers.map((phoneNumber, index) => (
            <Flex key={index} direction="row" alignItems="center" mb={2}>
              <Flex
                flex="1"
                alignItems="flex-start"
                justifyContent="center"
                height="100%"
              >
                {index === 0 && (
                  <PhoneIcon fontSize="small" style={{ marginTop: "10px" }} />
                )}
              </Flex>
              <Box flex="8">
                <Input
                  placeholder="Phone Number"
                  maxLength={16}
                  bgColor="gray.900"
                  borderColor="gray.700"
                  variant="flushed"
                  value={phoneCheck[index]?.number || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (
                      phonePattern.test(e.target.value) ||
                      e.target.value === ""
                    ) {
                      setPhoneCheck((prev) => {
                        const newPhones = [...prev];
                        newPhones[index] = { number: e.target.value };
                        return newPhones;
                      });
                    }
                  }}
                />
              </Box>
            </Flex>
          ))}
          <Flex
            direction="row"
            alignItems="center"
            mt={2}
            onClick={handleAddPhoneNumber}
            cursor="pointer"
          >
            <Flex
              flex="1"
              alignItems="center"
              justifyContent="center"
              height="100%"
            >
              <IconButton
                aria-label="Add"
                icon={<AddIcon />}
                bgColor="gray.900"
                _active={{ bgColor: "gray.700" }}
                size="lg"
                isRound
                variant="ghost"
                color={
                  phoneNumbers.length < maxPhoneNumbers
                    ? "gray.400"
                    : "gray.700"
                }
              />
            </Flex>
            <Box flex="8">
              <Text
                color={
                  phoneNumbers.length < maxPhoneNumbers
                    ? "gray.400"
                    : "gray.600"
                }
                fontSize="md"
              >
                Add phone number
              </Text>
            </Box>
            <Box flex="1"></Box>
          </Flex>
        </CardBody>
      </Card>
      <Center width="100%">
        <Button variant="ghost" marginRight="1rem" onClick={handleCancel}>
          Cancel
        </Button>
        <Divider orientation="vertical" height="20px" />
        <Button variant="ghost" marginLeft="1rem" onClick={handleSave}>
          Save
        </Button>
      </Center>
    </Box>
  );
};

export default ContactForm;
