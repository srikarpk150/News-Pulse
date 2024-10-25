import { ID, Account, Client } from 'appwrite';

const appwriteClient = new Client();

const APPWRITE_ENDPOINT: string = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID: string = process.env.EXPO_PUBLIC_APPWRITE_ID!;

type CreateUserAccount = {
  email: string;
  password: string;
  name: string;
};
type LoginUserAccount = {
  email: string;
  password: string;
};


class AppwriteService {
  account;

  constructor() {
    appwriteClient.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

    this.account = new Account(appwriteClient);
  }

  // Create a new user inside Appwrite
  async createAccount({ email, password, name }: CreateUserAccount, showSnackbar: (message: string) => void) {
    try {
      const userAccount = await this.account.create(ID.unique(), email, password, name);
      if (userAccount) {
        // Call login after successful account creation
        return this.login({ email, password }, showSnackbar);
      } else {
        return userAccount;
      }
    } catch (error) {
      showSnackbar(String(error));
      console.log('Appwrite service :: createAccount() :: ' + error);
    }
  }

  async login({ email, password }: LoginUserAccount, showSnackbar: (message: string) => void) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      showSnackbar('Login failed');
      showSnackbar(String(error));
      console.log('Appwrite service :: loginAccount() :: ' + error);
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log('Appwrite service :: getCurrentAccount() :: ' + error);
    }
  }

  async updateUserName(name :string,showSnackbar: (message: string) => void) {
    try {
      return await this.account.updateName(name);
    } catch (error) {
      console.log('Appwrite service :: updateUserName() :: ' + error);
    }
  }

  async updateUserEmail({ email, password }: LoginUserAccount,showSnackbar: (message: string) => void) {
    try {
      return await this.account.updateEmail(email,password)
    } catch (error) {
      console.log('Appwrite service :: updateUserEmail() :: ' + error);
    }
  }

  async logout(showSnackbar: (message: string) => void) {
    try {
      return await this.account.deleteSession('current');
    } catch (error) {
      showSnackbar(String(error)); 
      console.log('Appwrite service :: logout() :: ' + error);
    }
  }
}

export default AppwriteService;
