import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const contactsPath = path.resolve('db', 'contacts.json');

export async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: 'utf-8' });
  return  JSON.parse(data);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const result = contacts.find(contact => contact.id === contactId);
  return result || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(contact => contact.id === contactId);

  if (idx === -1) {
    return null;
  }

  const [result] = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return result;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();

  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

  return newContact;
}
