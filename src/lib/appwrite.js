import { Client, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint('https://cloud.appwrite.io/v1') 
  .setProject('673f06330007eb8bd6e4');

const account = new Account(client);

export { client, account };