import dal from "../04-dal/dal";
import CredentialsModel from "../03-models/CredentialsModel";
import ErrorModel from "../03-models/ErrorModel";
import RoleModel from "../03-models/RoleModel";
import UserModel from "../03-models/UserModel";
import cyber from "../01-utils/cyber";
import { OkPacket } from 'mysql';

async function register(user: UserModel): Promise<string> {

  
    const error = user.validateUser();
    if(error){
        throw new ErrorModel(400, error);
    }

    
    const isTaken = await isUsernameTaken(user.username);
    if (isTaken) {
        throw new ErrorModel(400, `Username ${user.username} already taken`);
    }

 
    user.password = cyber.hash(user.password);

    

   
    const sql = "INSERT INTO users VALUES(DEFAULT, ?, ?, ?, ?, ?)";

    const info: OkPacket = await dal.execute(sql, [user.firstName, user.lastName, user.username, user.password, RoleModel.User]);

    user.role = RoleModel.User;

    const userAfterDb = await getUserID(user.username, user.password);

    user.userId = userAfterDb.userId;


    delete user.password;



    const token = cyber.getNewToken(user);

   
    return token;
};

    async function getUserID(username, password) {
        const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
        const userAfterDb = await dal.execute(sql, [username, password]);
        return userAfterDb[0]
    }


async function login(credentials: CredentialsModel): Promise<string> {

    
    const error = credentials.validateCredential();
    if(error){
        throw new ErrorModel(400, error);
    }

   
    credentials.password = cyber.hash(credentials.password);
    
   
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;

  
    const users = await dal.execute(sql, [credentials.username, credentials.password]);

   
    if (users.length === 0) {
        throw new ErrorModel(401, "Incorrect username or password");
    }

    
    const user = users[0];

    
    delete user.password;


    const token = cyber.getNewToken(user);


    return token;
}

async function isUsernameTaken(username: string): Promise<boolean> {
    const sql = `SELECT COUNT(*) AS count FROM users WHERE username = '${username}'`;
    const table = await dal.execute(sql);
    const row = table[0];
    const count = row.count;
    return count > 0;
}

export default {
    register,
    login
}