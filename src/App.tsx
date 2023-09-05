import React, { useState, useEffect } from "react";
import { ChakraProvider, Slide } from "@chakra-ui/react";
import HeaderMobile from "./components/Header/HeaderMobile";
import PhoneContactList from "./components/PhoneContactList/PhoneContactList";
import ContactForm from "./components/forms/ContactForm";
import { useMutation, useQuery } from "@apollo/client";
import {
  Contact,
  GetContactListResponse,
  Phone,
} from "./interfaces/GetContactListResponse";
import { GET_CONTACT_LIST } from "./graphql/contact/queries";
import {
  ADD_CONTACT_WITH_PHONES,
  ADD_PHONE_NUMBER_BY_ID,
  DELETE_PHONE_NUMBER_BY_ID,
  EDIT_CONTACT_BY_ID,
  EDIT_PHONE_NUMBER_BY_ID,
} from "./graphql/contact/mutations";
import { theme } from "./theme/theme";

export const App = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null); // New state for selected contact
  const [isEditing, setIsEditing] = useState(false);

  const [contactListChanged, setContactListChanged] = useState(false);

  const [editContactById] = useMutation(EDIT_CONTACT_BY_ID);
  const [addContactById] = useMutation(ADD_CONTACT_WITH_PHONES);
  const [editPhoneById] = useMutation(EDIT_PHONE_NUMBER_BY_ID);
  const [addPhoneById] = useMutation(ADD_PHONE_NUMBER_BY_ID);

  const [deleteContactById] = useMutation(DELETE_PHONE_NUMBER_BY_ID);

  const handleNameChangeCommit = async (
    id: number,
    firstName: string,
    lastName: string
  ) => {
    await editContactById({
      variables: {
        id: id,
        _set: { id: id, first_name: firstName, last_name: lastName },
      },
    });
  };

  const handleNameAddCommit = async (
    firstName: string,
    lastName: string,
    phones: Phone[]
  ) => {
    await addContactById({
      variables: {
        first_name: firstName,
        last_name: lastName,
        phones: phones,
      },
    });
  };

  const handlePhoneChangeCommit = async (
    id: number,
    oldNumber: string,
    newNumber: string
  ) => {
    await editPhoneById({
      variables: {
        pk_columns: {
          number: oldNumber,
          contact_id: id,
        },
        new_phone_number: newNumber,
      },
    });
  };

  const handlePhoneAddCommit = async (id: number, newNumber: string) => {
    await addPhoneById({
      variables: {
        contact_id: id,
        phone_number: newNumber,
      },
    });
  };

  const handleDeleteContactCommit = async (id: number) => {
    await deleteContactById({
      variables: {
        id: id,
      },
    });
  };

  const handleEditContact = (contact: Contact) => {
    setIsEditing(true);
    setSelectedContact(contact);
    setShowContactForm(true);
  };

  const { loading, error, data, refetch } = useQuery<GetContactListResponse>(
    GET_CONTACT_LIST,
    {
      variables: {
        // Provide necessary variables here, e.g., distinct_on, limit, etc.
      },
    }
  );

  useEffect(() => {
    console.log("contactChanged: ", contactListChanged);
  }, [contactListChanged]);

  return (
    <ChakraProvider theme={theme} cssVarsRoot="body">
      <Slide
        in={!showContactForm}
        direction="left"
        style={{ overflowY: "auto" }}
      >
        <HeaderMobile
          onPlusIconClick={() => setShowContactForm(true)}
          showAddContact={showContactForm}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <PhoneContactList
          searchValue={searchValue}
          onEditContact={handleEditContact}
          loading={loading}
          error={error}
          data={data}
          refetch={refetch}
          contactListChanged={contactListChanged}
          setContactListChanged={setContactListChanged}
          handleDeleteContactCommit={handleDeleteContactCommit}
        />
      </Slide>
      <Slide
        in={showContactForm}
        direction="right"
        style={{ overflowY: "auto" }}
      >
        <HeaderMobile
          onPlusIconClick={() => setShowContactForm(true)}
          showAddContact={showContactForm}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
        <ContactForm
          onCancelOrSave={() => setShowContactForm(false)}
          contact={selectedContact}
          loading={loading}
          error={error}
          data={data}
          refetch={refetch}
          contactListChanged={contactListChanged}
          setContactListChanged={setContactListChanged}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleNameChangeCommit={handleNameChangeCommit}
          handleNameAddCommit={handleNameAddCommit}
          handlePhoneChangeCommit={handlePhoneChangeCommit}
          handlePhoneAddCommit={handlePhoneAddCommit}
        />
      </Slide>
    </ChakraProvider>
  );
};
