import { ID, Account, Client, Databases, Query } from 'appwrite';

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
type ResetPassword = {
  oldPassword: string;
  newPassword: string;
};

class AppwriteService {
  account: Account;
  databases: Databases; 

  constructor() {
    appwriteClient.setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID);

    this.account = new Account(appwriteClient);
    this.databases = new Databases(appwriteClient);
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

  async updateUserName(name: string, showSnackbar: (message: string) => void) {
    try {
      return await this.account.updateName(name);
    } catch (error) {
      console.log('Appwrite service :: updateUserName() :: ' + error);
    }
  }

  async updateUserEmail({ email, password }: LoginUserAccount, showSnackbar: (message: string) => void) {
    try {
      return await this.account.updateEmail(email, password);
    } catch (error) {
      console.log('Appwrite service :: updateUserEmail() :: ' + error);
    }
  }

  async resetUserPassword({ oldPassword, newPassword }: ResetPassword, showSnackbar: (message: string) => void) {
    try {
      return await this.account.updatePassword(newPassword, oldPassword);
    } catch (error) {
      console.log('Appwrite service :: resetUserPassword() :: ' + error);
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

  async createpreferences({ userid, categories }: { userid: string, categories: { interested_categories: string[] } },showSnackbar: (message: string) => void) {
    try {
        const response = await this.databases.createDocument('671efa3b00309d311500','671efa500009f2d5adee',ID.unique(),{userid: userid,interested_categories: categories.interested_categories},[`read("user:${userid}")`, `write("user:${userid}")`] );
        return response;
    } catch (error) {
        showSnackbar(String(error));
        console.log('Appwrite service :: createpreferences() :: ' + error);
    }
  }

  async savepreferences({ documentid, userid, categories }: { documentid: string, userid: string, categories: { interested_categories: string[] } },showSnackbar: (message: string) => void) {
    try {
        const response = await this.databases.updateDocument('671efa3b00309d311500','671efa500009f2d5adee', documentid,{userid: userid,interested_categories: categories.interested_categories},[`read("user:${userid}")`, `write("user:${userid}")`]);
        return response;
    } catch (error) {
        showSnackbar(String(error));
        console.log('Appwrite service :: savepreferences() :: ' + error);
    }
}

async getpreferences({ userid }: { userid: string },showSnackbar: (message: string) => void) {
  try {
      const result = await this.databases.listDocuments('671efa3b00309d311500','671efa500009f2d5adee',[Query.equal("userid", userid)]);
      if (result.documents.length > 0) {
          return result.documents[0];
      } else {
          showSnackbar("No preferences found for this user.");
          return null;
      }
    } catch (error) {
        showSnackbar(String(error));
        console.log('Appwrite service :: getpreferences() :: ' + error);
    }
  }

}

export default AppwriteService;
