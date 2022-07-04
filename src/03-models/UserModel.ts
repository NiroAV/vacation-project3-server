import RoleModel from "./RoleModel";
import Joi from 'joi';


class UserModel {
    public userId: number|string;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public role: RoleModel;

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.role = user.role;
    }

     
           private static schemaUser = Joi.object({
            userId: Joi.optional(),
            firstName: Joi.string().required().max(50).min(2),
            lastName: Joi.string().required().max(50).min(2),
            username: Joi.string().required().max(20).min(4),
            password: Joi.string().required().max(20).min(4),
            role: Joi.optional()
        });
    
      
        public validateUser(): string {
    
           
            const result = UserModel.schemaUser.validate(this);
    
            return result.error?.message;
        }

    

}

export default UserModel;