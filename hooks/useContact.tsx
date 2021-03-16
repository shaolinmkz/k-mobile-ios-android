// @ts-nocheck
import { useState, useEffect } from "react";
import * as Contacts from "expo-contacts";

interface ContactType {
  emails: Contacts.Email[];
  phoneNumbers: Contacts.PhoneNumber[];
  firstName: string;
  lastName: string;
  id: string;
  contactType: any;
  name: string;
}

export const useContact = () => {
  const [contacts, setContacts] = useState([
    {
      emails: [],
      phoneNumbers: [],
      firstName: "",
      lastName: "",
      id: "",
      contactType: "",
      name: "",
    },
  ]);

  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState("");

  const handleCheck = (value: string) => {
    setSelectedPhoneNumber(value);
  };

  const handleContactSearch = (value: string) => {
    setContactSearchTerm(value);
  };

  const unPackContacts = (data: Contacts.Contact[]): Promise<ContactType[]> => {
    return new Promise((resolve) => {
      const unpackedData = data.map(
        ({
          id,
          phoneNumbers,
          firstName,
          lastName,
          emails,
          contactType: contactTypeOverride,
          name,
        }) => ({
          phoneNumbers,
          emails,
          id,
          firstName,
          lastName,
          contactType: contactTypeOverride,
          name,
        })
      );

      resolve(unpackedData);
    });
  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync();

        if (data?.length) {
          const contactData = unPackContacts(data);
          setContacts(contactData);
        }
      }
    })();
  }, []);

  return {
    handleContactSearch,
    handleCheck,
    contactSearchTerm,
    selectedPhoneNumber,
    contacts,
  };
};
