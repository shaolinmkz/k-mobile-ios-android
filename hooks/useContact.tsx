// @ts-nocheck
import { useState, useEffect } from "react";
import randomColor from "randomcolor";
import * as Contacts from "expo-contacts";

export interface ContactType {
  emails: Contacts.Email[];
  phoneNumbers: Contacts.PhoneNumber[];
  firstName: string;
  lastName: string;
  id: string;
  contactType: any;
  name: string;
  initials?: string;
  displayColor?: string;
}

export const useContact = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);

  const [contactSearchTerm, setContactSearchTerm] = useState("");

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
          displayColor: randomColor({ luminosity: 'dark'}),
          initials: `${`${firstName}`.toUpperCase().slice(0, 1)}${`${lastName}`.toUpperCase().slice(0, 1)}`
        })
      ).sort((a, b) => `${a.name}`.toLowerCase().localeCompare(`${b.name}`.toLowerCase()));

      resolve(unpackedData);
    });
  };


  const getContacts = () => {
    return Contacts.requestPermissionsAsync()
    .then(({ status }) => {
      if (status === "granted") {
        Contacts.getContactsAsync()
        .then(({ data }) => {
          if (data?.length) {
            unPackContacts(data).then(contactData => {
              setContacts(contactData);
            });
            return data;
          }
        })
      }
    })
  }

  useEffect(() => {
    getContacts();
  }, []);

  return {
    handleContactSearch,
    contactSearchTerm,
    contacts,
    searchedContacts: contacts?.filter?.(({ firstName, lastName, emails, phoneNumbers, name }) => {
      const contactSearchTermLC = contactSearchTerm.toLowerCase();
      if(`${name}`.toLowerCase().includes(contactSearchTermLC)) {
        return true
      } else if(`${firstName}`.toLowerCase().includes(contactSearchTermLC)) {
        return true
      } else if (`${lastName}`.toLowerCase().includes(contactSearchTermLC)) {
        return true
      } else if (emails?.find?.((data) => `${data?.email}`.toLowerCase().includes(contactSearchTermLC))) {
        return true
      } else if (phoneNumbers?.find?.(data => `${data?.number}`.toLowerCase().includes(contactSearchTermLC))) {
        return true
      }
      return false
    }),
  };
};
