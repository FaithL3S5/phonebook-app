import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Collapse,
  Divider,
  Flex,
  IconButton,
  List,
  ListItem,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Info from "@mui/icons-material/Info";
import { StarIcon } from "@chakra-ui/icons";
import SetAsDefaultModal from "../modal/SetAsDefaultModal";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";
import { ApolloError } from "@apollo/client";
import {
  GetContactListResponse,
  Contact,
} from "../../interfaces/GetContactListResponse";
import AppShortcutIcon from "@mui/icons-material/AppShortcut";

interface PhoneContactListProps {
  searchValue: string;
  onEditContact: (contact: Contact) => void;
  loading: boolean;
  error: ApolloError | undefined;
  data: GetContactListResponse | undefined;
  refetch: () => void;
  contactListChanged: boolean;
  setContactListChanged: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteContactCommit: (id: number) => void;
}

const getRandomColor = (userName: string) => {
  const colors = [
    "red.200",
    "blue.200",
    "green.200",
    "yellow.200",
    "pink.200",
    "purple.200",
    "orange.200",
  ];

  // Check if the user already has an assigned color in localStorage
  let userColor = localStorage.getItem(userName);

  if (!userColor) {
    // If not, assign a random color and store it in localStorage
    userColor = colors[Math.floor(Math.random() * colors.length)];
    localStorage.setItem(userName, userColor);
  }

  return userColor;
};

function formatPhoneNumber(phoneNumber: string): string {
  const len = phoneNumber.length;

  if (len <= 4) {
    return phoneNumber;
  } else if (len <= 8) {
    return `${phoneNumber.substring(0, len - 4)}-${phoneNumber.substring(
      len - 4
    )}`;
  } else if (len === 9) {
    return `(${phoneNumber.substring(0, 1)})${phoneNumber.substring(
      1,
      len - 4
    )}-${phoneNumber.substring(len - 4)}`;
  } else if (len <= 11) {
    return `(${phoneNumber.substring(0, len - 8)})${phoneNumber.substring(
      len - 8,
      len - 4
    )}-${phoneNumber.substring(len - 4)}`;
  } else {
    const part1 = phoneNumber.substring(0, 1);
    const part2 = phoneNumber.substring(1, 4);
    const part3 = phoneNumber.substring(4, 8);
    const part4 = phoneNumber.substring(8, 99);
    return `(${part1})${part2}-${part3}-${part4}`;
  }
}

const PhoneContactList: React.FC<PhoneContactListProps> = ({
  searchValue,
  onEditContact,
  data,
  refetch,
  contactListChanged,
  setContactListChanged,
  handleDeleteContactCommit,
}) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const initialFavorites = JSON.parse(
    localStorage.getItem("favorites") || "[]"
  );
  const [favorites, setFavorites] = useState<string[]>(initialFavorites);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isSmallScreen, isMediumScreen, isLargeScreen] = useMediaQuery([
    "(max-width: 375px)", // iPhone SE 2nd gen has a width of 375px
    "(min-width: 376px) and (max-width: 768px)", // Medium screen (phones with bigger screen)
    "(min-width: 769px)", // Large screen (desktop)
  ]);

  const [itemsPerPage, setItemsPerPage] = useState(3);

  // const contact = data?.contact;
  const transformedContact = {
    ...data,
    contact: data?.contact.map((contact) => ({
      ...contact,
      name: `${contact.first_name} ${contact.last_name}`,
    })),
  };

  const handleOpenModal = (transformedContact: Contact) => {
    setCurrentContact(transformedContact);
    setModalOpen(true);
  };

  const handleSetDefault = () => {
    // Logic to set the selected phone number as default for the current contact
    // You might want to save this preference in local storage or state
    setModalOpen(false);
  };

  useEffect(() => {
    // Check if favorites have been loaded from localStorage before writing
    if (favorites.length > 0 || localStorage.getItem("favorites")) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    // declare the data fetching function
    const fetchData = async () => {
      refetch();
      setContactListChanged(false);
    };

    // call the function
    fetchData();
  }, [contactListChanged, deleteConfirmation]);

  useEffect(() => {
    if (isSmallScreen) {
      setItemsPerPage(3);
    } else if (isMediumScreen) {
      setItemsPerPage(5);
    } else if (isLargeScreen) {
      setItemsPerPage(6);
    }
  }, [isSmallScreen, isMediumScreen, isLargeScreen]);

  const toggleFavorite = (event: React.MouseEvent, contactName: string) => {
    event.stopPropagation();

    if (favorites.includes(contactName)) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((name) => name !== contactName)
      );
    } else {
      setFavorites((prevFavorites) => [...prevFavorites, contactName]);
    }
  };

  const toggleCardExpansion = (contactName: string) => {
    if (expandedCard === contactName) {
      setExpandedCard(null);
    } else {
      setExpandedCard(contactName);
    }
  };

  const handleIconClick = (event: React.MouseEvent, contact: Contact) => {
    event.stopPropagation(); // Prevent the click event from propagating up to the ListItem
    onEditContact(contact);
  };

  const filteredContacts =
    transformedContact.contact?.filter((contact) =>
      contact.name.toLowerCase().includes(searchValue.toLowerCase())
    ) || [];

  if (filteredContacts?.length === 0 && searchValue) {
    return (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Text color="gray.500" fontSize="xl">
          Nothing here...
        </Text>
      </Flex>
    );
  }

  // Sort the contacts alphabetically
  const sortedFavoriteContacts: Contact[] = filteredContacts
    .filter((contact) => favorites.includes(contact.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  const sortedNormalContacts: Contact[] = filteredContacts
    .filter((contact) => !favorites.includes(contact.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  let currentLetter = "";
  let cardContents: JSX.Element[] = [];
  let displayLetterElement: JSX.Element | null = null;

  const renderCard = () => {
    if (cardContents.length === 0) return null;

    return (
      <Card borderRadius="3xl" marginBottom="1rem" bgColor="gray.900">
        <CardBody>
          <Stack spacing={2}>{cardContents}</Stack>
        </CardBody>
      </Card>
    );
  };

  const getDefaultPhoneNumber = (
    contactName: string,
    phoneNumbers: string[]
  ) => {
    let defaultNumber = localStorage.getItem(`default-${contactName}`);

    if (!defaultNumber) {
      localStorage.setItem(`default-${contactName}`, phoneNumbers[0]);
      defaultNumber = localStorage.getItem(`default-${contactName}`);
    }

    return defaultNumber || phoneNumbers[0];
  };

  const handleDeleteIconClick = (
    event: React.MouseEvent,
    transformedContact: Contact
  ) => {
    event.stopPropagation(); // Prevent the click event from propagating up to the ListItem
    setContactToDelete(transformedContact);
    setDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const conjoinedContact = [...sortedFavoriteContacts, ...sortedNormalContacts];

  const totalPages = Math.ceil(conjoinedContact.length / itemsPerPage);

  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 2, 1); // Adjusted from -3 to -2
    let end = Math.min(start + 4, totalPages); // Adjusted from +6 to +4

    if (currentPage <= 3) {
      // Adjusted from 4 to 3
      start = 1;
      end = Math.min(5, totalPages); // Adjusted from 7 to 5
    } else if (currentPage > totalPages - 3) {
      // Adjusted from -4 to -3
      start = Math.max(totalPages - 4, 1); // Adjusted from -6 to -4
      end = totalPages;
    }
    return new Array(end - start + 1)
      .fill(undefined)
      .map((_, idx) => start + idx);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = conjoinedContact.slice(startIndex, endIndex);

  const favoriteData = currentData.filter((contact) =>
    favorites.includes(contact.name)
  );
  const normalData = currentData.filter(
    (contact) => !favorites.includes(contact.name)
  );

  const prevPageFavoriteLastContactLetter = favoriteData[0]
    ? favoriteData[0].name[0].toUpperCase()
    : null;
  const nextPageFavoriteFirstContactLetter = favoriteData[itemsPerPage]
    ? favoriteData[itemsPerPage].name[0].toUpperCase()
    : null;

  const prevPageNormalLastContactLetter = normalData[0]
    ? normalData[0].name[0].toUpperCase()
    : null;
  const nextPageNormalFirstContactLetter = normalData[itemsPerPage]
    ? normalData[itemsPerPage].name[0].toUpperCase()
    : null;

  return (
    <>
      <SetAsDefaultModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        contact={currentContact}
        onSetDefault={handleSetDefault}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        handleDeleteContactCommit={handleDeleteContactCommit}
        contact={contactToDelete}
        setDeleteConfirmation={setDeleteConfirmation}
      />

      <Flex direction="column" height="100vh" padding="1rem">
        <Box flexGrow={1}>
          <Card borderRadius="3xl" marginBottom="1rem" bgColor="gray.900">
            <CardBody>
              <Center>
                <IconButton
                  aria-label="App Logo"
                  icon={<AppShortcutIcon />}
                  borderRadius="full"
                  boxSize="40px"
                  color="white"
                  bgColor="gray.900"
                  cursor="default"
                />
                <Flex direction="column" alignItems="start" flex="1">
                  <Text fontSize="sm" color="white" fontWeight="semibold">
                    A Simple Phonebook App
                  </Text>
                </Flex>
              </Center>
            </CardBody>
          </Card>

          <Divider my={4} />
          <List
            spacing={3}
            display={
              currentData.filter((contact) => favorites.includes(contact.name))
                .length > 0
                ? "block"
                : "none"
            }
          >
            <Text fontSize="md" fontWeight="bold" marginBottom="1rem">
              Favorites ({favorites.length})
            </Text>
            {favoriteData.map((contact, index) => {
              const firstLetter = contact.name[0].toUpperCase();

              // Check if the letter has changed from the previous contact
              if (
                (firstLetter !== currentLetter &&
                  firstLetter !== prevPageFavoriteLastContactLetter) ||
                currentLetter.length < 1
              ) {
                currentLetter = firstLetter;
                displayLetterElement = (
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    key={`header-${currentLetter}`}
                    marginBottom="0.5rem"
                  >
                    {currentLetter}
                  </Text>
                );
              }

              cardContents.push(
                <React.Fragment key={contact.name}>
                  <ListItem onClick={() => toggleCardExpansion(contact.name)}>
                    <Flex direction="column" width="100%">
                      <Flex alignItems="center">
                        <Avatar
                          size="sm"
                          name={contact.name}
                          bg={getRandomColor(contact.name)}
                          marginRight="1rem"
                          fontWeight="bold"
                          color="black"
                        />
                        <Flex direction="column" alignItems="start" flex="1">
                          <Text
                            fontSize="sm"
                            color="white"
                            fontWeight="semibold"
                          >
                            {contact.name}
                          </Text>
                          <Collapse in={expandedCard === contact.name}>
                            <Flex
                              alignItems="center"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <Text
                                fontSize="sm"
                                marginRight="0.5rem"
                                color={
                                  contact.phones.length > 1
                                    ? "green.500"
                                    : "white"
                                }
                                fontWeight="semibold"
                                onClick={() => {
                                  contact.phones.length > 1
                                    ? handleOpenModal(contact)
                                    : console.log("no modal for this one");
                                }}
                              >
                                Mobile{" "}
                                {formatPhoneNumber(
                                  getDefaultPhoneNumber(
                                    contact.name,
                                    contact.phones.length > 0
                                      ? contact.phones.map(
                                          (phone) => phone.number
                                        )
                                      : []
                                  )
                                )}
                              </Text>
                              {contact.phones.length > 1 && (
                                <Box
                                  as={Info}
                                  fontSize="1em"
                                  color="green.500"
                                  style={{
                                    verticalAlign: "middle",
                                    fontSize: "14px",
                                  }}
                                />
                              )}
                            </Flex>
                          </Collapse>
                        </Flex>
                      </Flex>
                      <Collapse in={expandedCard === contact.name}>
                        <Flex
                          justifyContent="center"
                          width="100%"
                          marginTop="0.5rem"
                        >
                          <IconButton
                            aria-label="Star"
                            icon={
                              favorites.includes(contact.name) ? (
                                <StarIcon color="yellow.400" />
                              ) : (
                                <StarBorderIcon />
                              )
                            }
                            color="gray.400"
                            bgColor="gray.900"
                            marginRight="1rem"
                            onClick={(event) =>
                              toggleFavorite(event, contact.name)
                            }
                            _active={{ bgColor: "gray.700" }}
                          />
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            color="orange.400"
                            bgColor="gray.900"
                            marginRight="1rem"
                            onClick={(event) => handleIconClick(event, contact)}
                            _active={{ bgColor: "gray.700" }}
                          />
                          <IconButton
                            aria-label="Delete"
                            icon={<DeleteIcon />}
                            color="red.400"
                            bgColor="gray.900"
                            onClick={(event) =>
                              handleDeleteIconClick(event, contact)
                            }
                            _active={{ bgColor: "gray.700" }}
                          />
                        </Flex>
                      </Collapse>
                    </Flex>
                  </ListItem>
                </React.Fragment>
              );

              // If the next contact has a different first letter or it's the last contact, render the card
              if (
                index === favoriteData.length - 1 ||
                (favoriteData[index + 1] &&
                  favoriteData[index + 1].name[0].toUpperCase() !==
                    currentLetter &&
                  favoriteData[index + 1].name[0].toUpperCase() !==
                    nextPageFavoriteFirstContactLetter) ||
                (index + 1) % itemsPerPage === 0
              ) {
                const card = renderCard();
                cardContents = []; // Reset card contents after rendering
                const currentDisplayLetterElement = displayLetterElement;
                displayLetterElement = null; // Reset display letter after rendering
                currentLetter = "";

                return (
                  <React.Fragment key={contact.name}>
                    {currentDisplayLetterElement}
                    {card}
                  </React.Fragment>
                );
              } else {
                cardContents.push(<Divider key={`divider-${contact.name}`} />);
                return null; // Don't render anything yet
              }
            })}
          </List>
          <Divider my={4} />
          <List spacing={3}>
            {normalData.map((contact, index) => {
              const firstLetter = contact.name[0].toUpperCase();

              // Check if the letter has changed from the previous contact
              if (
                (firstLetter !== currentLetter &&
                  firstLetter !== prevPageNormalLastContactLetter) ||
                currentLetter.length < 1
              ) {
                currentLetter = firstLetter;
                displayLetterElement = (
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    key={`header-${currentLetter}`}
                    marginBottom="0.5rem"
                  >
                    {currentLetter}
                  </Text>
                );
              }

              cardContents.push(
                <React.Fragment key={contact.name}>
                  <ListItem onClick={() => toggleCardExpansion(contact.name)}>
                    <Flex direction="column" width="100%">
                      <Flex alignItems="center">
                        <Avatar
                          size="sm"
                          name={contact.name}
                          bg={getRandomColor(contact.name)}
                          marginRight="1rem"
                          fontWeight="bold"
                          color="black"
                        />
                        <Flex direction="column" alignItems="start" flex="1">
                          <Text
                            fontSize="sm"
                            color="white"
                            fontWeight="semibold"
                          >
                            {contact.name}
                          </Text>
                          <Collapse in={expandedCard === contact.name}>
                            <Flex
                              alignItems="center"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <Text
                                fontSize="sm"
                                marginRight="0.5rem"
                                color={
                                  contact.phones.length > 1
                                    ? "green.500"
                                    : "white"
                                }
                                fontWeight="semibold"
                                onClick={() => {
                                  contact.phones.length > 1
                                    ? handleOpenModal(contact)
                                    : console.log("no modal for this one");
                                }}
                              >
                                Mobile{" "}
                                {formatPhoneNumber(
                                  getDefaultPhoneNumber(
                                    contact.name,
                                    contact.phones.length > 0
                                      ? contact.phones.map(
                                          (phone) => phone.number
                                        )
                                      : []
                                  )
                                )}
                              </Text>
                              {contact.phones.length > 1 && (
                                <Box
                                  as={Info}
                                  fontSize="1em"
                                  color="green.500"
                                  style={{
                                    verticalAlign: "middle",
                                    fontSize: "14px",
                                  }}
                                />
                              )}
                            </Flex>
                          </Collapse>
                        </Flex>
                      </Flex>
                      <Collapse in={expandedCard === contact.name}>
                        <Flex
                          justifyContent="center"
                          width="100%"
                          marginTop="0.5rem"
                        >
                          <IconButton
                            aria-label="Star"
                            icon={
                              favorites.includes(contact.name) ? (
                                <StarIcon color="yellow.400" />
                              ) : (
                                <StarBorderIcon />
                              )
                            }
                            color="gray.400"
                            bgColor="gray.900"
                            marginRight="1rem"
                            onClick={(event) =>
                              toggleFavorite(event, contact.name)
                            }
                            _active={{ bgColor: "gray.700" }}
                          />
                          <IconButton
                            aria-label="Edit"
                            icon={<EditIcon />}
                            color="orange.400"
                            bgColor="gray.900"
                            marginRight="1rem"
                            onClick={(event) => handleIconClick(event, contact)}
                            _active={{ bgColor: "gray.700" }}
                          />
                          <IconButton
                            aria-label="Delete"
                            icon={<DeleteIcon />}
                            color="red.400"
                            bgColor="gray.900"
                            onClick={(event) =>
                              handleDeleteIconClick(event, contact)
                            }
                            _active={{ bgColor: "gray.700" }}
                          />
                        </Flex>
                      </Collapse>
                    </Flex>
                  </ListItem>
                </React.Fragment>
              );

              // If the next contact has a different first letter or it's the last contact, render the card
              if (
                index === normalData.length - 1 ||
                (normalData[index + 1] &&
                  normalData[index + 1].name[0].toUpperCase() !==
                    currentLetter &&
                  normalData[index + 1].name[0].toUpperCase() !==
                    nextPageNormalFirstContactLetter) ||
                (index + 1) % itemsPerPage === 0
              ) {
                const card = renderCard();
                cardContents = []; // Reset card contents after rendering
                const currentDisplayLetterElement = displayLetterElement;
                displayLetterElement = null; // Reset display letter after rendering
                currentLetter = "";
                return (
                  <React.Fragment key={contact.name}>
                    {currentDisplayLetterElement}
                    {card}
                  </React.Fragment>
                );
              } else {
                cardContents.push(<Divider key={`divider-${contact.name}`} />);
                return null; // Don't render anything yet
              }
            })}
          </List>
        </Box>
        <Center position="sticky" bottom="0" py={4}>
          <Button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            bgColor={currentPage === 1 ? "black" : "gray.900"}
            variant="outline"
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            bgColor={currentPage === 1 ? "black" : "gray.900"}
            variant="outline"
          >
            {"<"}
          </Button>
          {getPaginationGroup().map((item, index) => (
            <Button
              key={index}
              onClick={() => setCurrentPage(item)}
              bgColor={currentPage === item ? "gray.600" : "gray.900"}
              variant="outline"
            >
              {item}
            </Button>
          ))}
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            bgColor={currentPage === totalPages ? "black" : "gray.900"}
            variant="outline"
          >
            {">"}
          </Button>
          <Button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            bgColor={currentPage === totalPages ? "black" : "gray.900"}
            variant="outline"
          >
            {">>"}
          </Button>
        </Center>
      </Flex>
    </>
  );
};

export default PhoneContactList;
