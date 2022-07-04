import Joi from 'joi';

class CredentialsModel {
    public username: string;
    public password: string;

    public constructor(user: CredentialsModel) {
        this.username = user.username;
        this.password = user.password;
    }

    private static schemaCredential = Joi.object({
        username: Joi.string().required().max(50).min(2),
        password: Joi.string().required().max(50).min(2)
    });

    
    public validateCredential(): string {

       
        const result = CredentialsModel.schemaCredential.validate(this);

        return result.error?.message;
    }
}

export default CredentialsModel;